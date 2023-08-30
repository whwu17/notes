---
layout: post
title: Multiprocess problem in FastAPI TimedRotatingFileHandler
categories: Development
tags: [develop, fastapi]
author: Wu Wenhan, weixin_34041003
---

## 日志信息打印

%(levalno)s：打印日志级别对应的整数数值；

%(levelname)s：打印日志级别的名称信息；

%(pathname)s：打印当前正在执行程序的程序路径；

%(filename)s：打印当前正在执行程序的名称或文件名；

%(funcName)：打印当前日志记录执行操作的函数名称；

%(lineno)d：打印当前日志记录执行操作的代码行号；

%(asctime)s：打印当前日志记录执行操作的时间；

%(thread)d：打印当前日志记录执行操作的线程编号；

%(threadName)s：打印正在执行的线程名称；

%(process)d：打印当前正在执行的进程编号；

%(message)：打印日志描述信息。

## TimedRotatingFileHandler

class logging.handlers.TimedRotatingFileHandler(filename, when='h', interval=1, backupCount=0, encoding=None, delay=False, utc=False, atTime=None)

TimedRotatingFileHandler 的各参数的详解：

filename：文件名，指定日志文件的路径和名称；
when：日志轮转的时间间隔，可选值为 ‘S’、‘M’、‘H’、‘D’、‘W’ 和 ‘midnight’，分别表示秒、分、时、天、周和每天的午夜；默认值为 ‘midnight’，即每天的午夜轮转，值不区分大小写；

interval：时间间隔的数量，默认为 1；例如，当 when=‘D’ 且 interval=7 时，表示每周轮转一次；

backupCount：备份文件数目；当生成的日志文件数量超过该数目时，会自动删除旧的备份日志文件；默认值为 0，表示不备份；

encoding：日志文件的编码格式，默认为 None，表示使用系统默认编码；

delay：是否延时打开文件，可选值为 True 和 False；当为 True 时，表示延时打开文件，即在第一次写入日志时才打开日志文件；当为 False 时，表示在初始化时即打开日志文件；默认值为 False；

utc：是否使用 UTC 时间，默认为 False，表示使用本地时间

atTime：用来设置轮转时间，格式为 ‘%H:%M:%S’，默认为午夜 12 点；需要注意的是该参数仅在when为W/midnight时有效；

当使用基于星期的轮换时，星期一为 ‘W0’，星期二为 ‘W1’，以此类推直至星期日为 ‘W6’。 在这种情况下，传入的 interval 值不会被使用。

## 问题来源

比如现在 dfn 就是 info.log.2018-10-23 。那么我会看有没有存在这个文件，如果有我就会先删除掉，然后再看下 info.log 是否存在，如果存在就执行 rename.

所以问题就很明确了，如果同时有多个进程进入临界区，那么会导致 dfn 文件被删除多次，另外下面的 rename 可能也会产生混乱。

现在我们要做的就是首先认为文件存在即是已经有人 rename 成功过了，并且在判断文件不存在的时候只允许一个人去 rename ，其他进程如果正好进入临界区就等一等。

## 修改后代码
```
class MultiCompatibleTimedRotatingFileHandler(TimedRotatingFileHandler):

    def doRollover(self):
        if self.stream:
            self.stream.close()
            self.stream = None
        # get the time that this sequence started at and make it a TimeTuple
        currentTime = int(time.time())
        dstNow = time.localtime(currentTime)[-1]
        t = self.rolloverAt - self.interval
        if self.utc:
            timeTuple = time.gmtime(t)
        else:
            timeTuple = time.localtime(t)
            dstThen = timeTuple[-1]
            if dstNow != dstThen:
                if dstNow:
                    addend = 3600
                else:
                    addend = -3600
                timeTuple = time.localtime(t + addend)
        dfn = self.baseFilename + "." + time.strftime(self.suffix, timeTuple)
        # 兼容多进程并发 LOG_ROTATE
        if not os.path.exists(dfn):
            f = open(self.baseFilename, 'a')
            fcntl.lockf(f.fileno(), fcntl.LOCK_EX)
            if os.path.exists(self.baseFilename):
                os.rename(self.baseFilename, dfn)
        if self.backupCount > 0:
            for s in self.getFilesToDelete():
                os.remove(s)
        if not self.delay:
            self.stream = self._open()
        newRolloverAt = self.computeRollover(currentTime)
        while newRolloverAt <= currentTime:
            newRolloverAt = newRolloverAt + self.interval
        # If DST changes and midnight or weekly rollover, adjust for this.
        if (self.when == 'MIDNIGHT' or self.when.startswith('W')) and not self.utc:
            dstAtRollover = time.localtime(newRolloverAt)[-1]
            if dstNow != dstAtRollover:
                if not dstNow:  # DST kicks in before next rollover, so we need to deduct an hour
                    addend = -3600
                else:  # DST bows out before next rollover, so we need to add an hour
                    addend = 3600
                newRolloverAt += addend
        self.rolloverAt = newRolloverAt
```
