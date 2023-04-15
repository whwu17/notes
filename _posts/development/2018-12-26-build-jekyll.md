---
layout: post
title: Build Jekyll in Windows
categories: Development
tags: [develop, blog]
author: Wu Wenhan
---

修改自：http://winjeysong.com/2017/02/25/own-your-github-pages/

### Windows下配置Jekyll环境

#### 安装Ruby环境

1. [下载RubyInstaller](https://rubyinstaller.org/downloads/)，选择对应自己系统的版本。**（版本必须在2.5以下，包括2.5.0以上均失败）**
2. 安装RubyInstaller，中途需要勾选“Add Ruby executables to your PATH”。

#### 安装RubyGems

1. RubyGems* 是一个Ruby的包管理器（类似于apt-get pip），下载地址：[RubyGems](https://rubygems.org/pages/download/)，选择zip格式。 
2. 将上一步下载的ZIP文件解压缩至某一目录下（不可变），推荐与ruby同一路径。
3. 定位到该目录下，并安装。

```sh
cd d:/directory
ruby setup.rb
```

#### 安装Jekyll

1. 安装 *jekyll* 和 *jekyll-paginate*

```sh
$ gem install jekyll
$ gem install jekyll-paginate
```
2. 替换镜像方法（如果下载不稳定）：

```sh
$ gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
$ gem sources -l  //这一步是为了确保镜像只有一个
Output: https://gems.ruby-china.org
```

3. 其他常用命令：

```ruby
$ gem -v  //查看当前版本
$ gem update jekyll  //升级
```

#### 创建静态页面

如果通过github-clone得到，则跳过本步骤。

1. 安装完 Jekyll 的 Gem包之后，通过一个最简单的模版来创建一个静态页面，并在本地运行。先定位到目标目录下，如：d:/myblog

```sh
cd d:/myblog
```

2. 在当前目录下创建一个本地仓库，里面是博客模版：

```sh
$ jekyll new . --force
```

#### 启动页面

1. Install the dependencies with [Bundler](http://bundler.io/):

```sh
$ bundle install
```

2. Run `jekyll` commands through Bundler to ensure you're using the right versions:

```sh
$ bundle exec jekyll serve
```

3. Visit from URL：*http://localhost:4000*。

#### 启动报错处理

```
Dependency Error: Yikes! It looks like you don't have tzinfo or one of its dependencies installed. In order to use Jekyll as currently configured, you'll need to install this gem. The full error message from Ruby is: 'cannot load such file -- tzinfo' If you run into trouble, you can find helpful resources at https://jekyllrb.com/help/!
jekyll 7.3.7 | Error: tzinfo
```

1. 安装`TZinfo`和`TZinfo::Data`（注意代码中data的d小写）

```ruby
$ gem install tzinfo
$ gem install tzinfo-data
```

2. 修改Gemfile文件，新增：

```ruby
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby] 
（32位系统：gem 'tzinfo-data', platforms: [:mingw, :mswin, :jruby]）
```
3. 重新安装tzinfo

```ruby
gem uninstall tzinfo
gem install tzinfo
```
4. 修改_config.yml，确保有Timezone字段（**注意属性名中的T大写**，例如`Timezone: "America/New_York" # Etc/UTC`）。
5. 重新启动页面

#### 常见错误

```sh
Deprecation: You appear to have pagination turned on, but you haven't included the `jekyll-paginate` gem. Ensure you have `gems: [jekyll-paginate]` in your configuration file.
```

解决方法：在本地仓库的目录下找到`_config.yml`配置文件，添加一行配置：

```ruby
gems: [jekyll-paginate]
```

