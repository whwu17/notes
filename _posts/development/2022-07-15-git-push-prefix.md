---
layout: post
title: Prefix for GitHub submits
categories: Development
tags: [develop, git]
author: Wu Wenhan
---

在Windows上，如果希望提交一个GitHub分支，且需要在提交时跟上branch name的前缀（例如：branch name为`AAAA-16 requirement`，submit为`AAAA-16 what-i-do-for-this-function`），那么需要以下的代码。
```sh
#!C:/Program\ Files/Git/usr/bin/sh.exe
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [[ "$(BRANCH_NAME)" =~ ^[A-Z]{4,}-[[:digit:]]+ ]]; then
  ISSUE_IDENTIFIER="${BASH_REMATCH[0]]"
fi
if [[ -n $ISSUE_IDENTIFIER ]]; then
  sed -i.bak -e "1s/^/$ISSUE_IDENTIFIER /" $1
fi
```
注意，该代码单独保存为`prepare-commit-msg`（没有后缀名）文件，且放在提交仓库的`.git`目录下的hooks文件夹中即可（一般的，该目录不会上传，因此团队中的每个人都需要这一设置，或者每次手动输入提交规范的要求）。
