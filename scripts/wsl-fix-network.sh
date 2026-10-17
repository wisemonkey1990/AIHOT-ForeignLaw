#!/usr/bin/env bash
# 代理软件的 fake-IP DNS 会把信源域名解析成 198.18.x.x，站点的内网防护因此拒绝抓取。
# 本脚本：用 DoH 取得真实 IP，写进 docker-compose.override.yml 的 worker extra_hosts，重启并实际抓一次验证。
# 用法（在仓库目录里）：bash scripts/wsl-fix-network.sh
set -u
cd "$(dirname "$0")/.."
command -v jq >/dev/null || { echo "需要 jq：sudo apt-get install -y jq"; exit 1; }

hosts=$(jq -r '.sources[].config.feedUrl' industry/sources.json | sed -E 's#https?://([^/]+)/.*#\1#' | sort -u)
# 订阅跳转和正文页常用的相关域名
extra="feeds.feedburner.com feeds2.feedburner.com www.opiniojuris.org opiniojuris.org www.un.org legal.un.org www.icc-cpi.int www.wto.org docs.wto.org www.hcch.net assets.hcch.net conflictoflaws.net"
all=$(printf '%s\n' $hosts $extra | sort -u)

doh() { # $1 域名 -> 一个公网 IPv4
  for url in "https://cloudflare-dns.com/dns-query" "https://dns.google/resolve" "https://1.1.1.1/dns-query"; do
    ip=$(curl -sS -m 8 -H 'accept: application/dns-json' "$url?name=$1&type=A" 2>/dev/null \
      | jq -r '[.Answer[]? | select(.type==1) | .data][0] // empty' 2>/dev/null)
    case "$ip" in ""|198.18.*|198.19.*|10.*|192.168.*|127.*) continue;; *) echo "$ip"; return;; esac
  done
}

out=docker-compose.override.yml
{
  echo "# 由 scripts/wsl-fix-network.sh 生成：绕开代理软件的 fake-IP DNS。IP 会变，失效时重跑脚本。"
  echo "services:"
  echo "  worker:"
  echo "    extra_hosts:"
} > "$out.tmp"
n=0
for h in $all; do
  ip=$(doh "$h")
  if [ -n "$ip" ]; then echo "      - \"$h:$ip\"" >> "$out.tmp"; echo "  $h -> $ip"; n=$((n+1)); else echo "  $h -> 解析失败，跳过"; fi
done
[ "$n" -gt 0 ] || { echo "一个域名也没解析成功：本机连 1.1.1.1 的 DoH 都不通。请把这条输出贴给我。"; rm -f "$out.tmp"; exit 1; }
mv "$out.tmp" "$out"

# 去掉之前可能写进 .env 的无效代理设置
sed -i '/^EGRESS_PROXY_URL=/d' .env 2>/dev/null
docker compose up -d
sleep 5
echo "== 验证：抓取每个信源"
for id in $(jq -r '.sources[].id' industry/sources.json); do
  docker compose exec -T worker node scripts/collect.ts "$id" 2>&1 | tail -1 | cut -c1-200
done
echo "== articles 数量"
docker compose exec -T db psql -U aihot -d aihot -tAc "select count(*) from articles"
