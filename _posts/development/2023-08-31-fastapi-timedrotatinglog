---
layout: post
title: Multiprocess problem in FastAPI TimedRotatingFileHandler
categories: Development
tags: [develop, fastapi]
author: Wu Wenhan, weixin_34041003
---
问题来源：

比如现在 dfn 就是 info.log.2018-10-23 。那么我会看有没有存在这个文件，如果有我就会先删除掉，然后再看下 info.log 是否存在，如果存在就执行 rename.

所以问题就很明确了，如果同时有多个进程进入临界区，那么会导致 dfn 文件被删除多次，另外下面的 rename 可能也会产生混乱。

现在我们要做的就是首先认为文件存在即是已经有人 rename 成功过了，并且在判断文件不存在的时候只允许一个人去 rename ，其他进程如果正好进入临界区就等一等。


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
