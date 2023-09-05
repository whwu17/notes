---
---
## Linux Signal Processing

Linux支持的信号列表如下。很多信号是与机器的体系结构相关的，首先列出的是POSIX.1中列出的信号：
```
信号 值 处理动作 发出信号的原因
----------------------------------------------------------------------
SIGHUP 1 A 终端挂起或者控制进程终止
SIGINT 2 A 键盘中断（如break键被按下）
SIGQUIT 3 C 键盘的退出键被按下
SIGILL 4 C 非法指令
SIGABRT 6 C 由abort(3)发出的退出指令
SIGFPE 8 C 浮点异常
SIGKILL 9 AEF Kill信号
SIGSEGV 11 C 无效的内存引用
SIGPIPE 13 A 管道破裂: 写一个没有读端口的管道
SIGALRM 14 A 由alarm(2)发出的信号
SIGTERM 15 A 终止信号
SIGUSR1 30,10,16 A 用户自定义信号1
SIGUSR2 31,12,17 A 用户自定义信号2
SIGCHLD 20,17,18 B 子进程结束信号
SIGCONT 19,18,25 进程继续（曾被停止的进程）
SIGSTOP 17,19,23 DEF 终止进程
SIGTSTP 18,20,24 D 控制终端（tty）上按下停止键
SIGTTIN 21,21,26 D 后台进程企图从控制终端读
SIGTTOU 22,22,27 D 后台进程企图从控制终端写
```

下面的信号没在POSIX.1中列出，而在SUSv2列出
```
信号 值 处理动作 发出信号的原因
--------------------------------------------------------------------
SIGBUS 10,7,10 C 总线错误(错误的内存访问)
SIGPOLL A Sys V定义的Pollable事件，与SIGIO同义
SIGPROF 27,27,29 A Profiling定时器到
SIGSYS 12,-,12 C 无效的系统调用 (SVID)
SIGTRAP 5 C 跟踪/断点捕获
SIGURG 16,23,21 B Socket出现紧急条件(4.2 BSD)
SIGVTALRM 26,26,28 A 实际时间报警时钟信号(4.2 BSD)
SIGXCPU 24,24,30 C 超出设定的CPU时间限制(4.2 BSD)
SIGXFSZ 25,25,31 C 超出设定的文件大小限制(4.2 BSD)
```
（对于SIGSYS，SIGXCPU，SIGXFSZ，以及某些机器体系结构下的SIGBUS，Linux缺省的动作是A (terminate)，SUSv2 是C (terminate and dump core)）。

下面是其它的一些信号：
```
信号 值 处理动作 发出信号的原因
----------------------------------------------------------------------
SIGIOT 6 C IO捕获指令，与SIGABRT同义
SIGEMT 7,-,7
SIGSTKFLT -,16,- A 协处理器堆栈错误
SIGIO 23,29,22 A 某I/O操作可以进行了(4.2 BSD)
SIGCLD -,-,18 A 与SIGCHLD同义
SIGPWR 29,30,19 A 电源故障(System V)
SIGINFO 29,-,- A 与SIGPWR同义
SIGLOST -,-,- A 文件锁丢失
SIGWINCH 28,28,20 B 窗口大小改变(4.3 BSD, Sun)
SIGUNUSED -,31,- A 未使用的信号(will be SIGSYS)
```
（在这里，- 表示信号没有实现；有三个值给出的含义为，第一个值通常在Alpha和Sparc上有效，中间的值对应i386和ppc以及sh，最后一个值对应mips。信号29在Alpha上为SIGINFO / SIGPWR ，在Sparc上为SIGLOST。）

处理动作一项中的字母含义如下：
```
A 缺省的动作是终止进程
B 缺省的动作是忽略此信号
C 缺省的动作是终止进程并进行内核映像转储（dump core）
D 缺省的动作是停止进程
E 信号不能被捕获
F 信号不能被忽略
```
## Bash exit code for shell

### List of common exit codes for GNU/Linux
```table
Exit Code	Description
0	Success
1	Operation not permitted
2	No such file or directory
3	No such process
4	Interrupted system call
5	Input/output error
6	No such device or address
7	Argument list too long
8	Exec format error
9	Bad file descriptor
10	No child processes
11	Resource temporarily unavailable
12	Cannot allocate memory
13	Permission denied
14	Bad address
15	Block device required
16	Device or resource busy
17	File exists
18	Invalid cross-device link
19	No such device
20	Not a directory
21	Is a directory
22	Invalid argument
23	Too many open files in system
24	Too many open files
25	Inappropriate ioctl for device
26	Text file busy
27	File too large
28	No space left on device
29	Illegal seek
30	Read-only file system
31	Too many links
32	Broken pipe
33	Numerical argument out of domain
34	Numerical result out of range
35	Resource deadlock avoided
36	File name too long
37	No locks available
38	Function not implemented
39	Directory not empty
40	Too many levels of symbolic links
42	No message of desired type
43	Identifier removed
44	Channel number out of range
45	Level 2 not synchronized
46	Level 3 halted
47	Level 3 reset
48	Link number out of range
49	Protocol driver not attached
50	No CSI structure available
51	Level 2 halted
52	Invalid exchange
53	Invalid request descriptor
54	Exchange full
55	No anode
56	Invalid request code
57	Invalid slot
59	Bad font file format
60	Device not a stream
61	No data available
62	Timer expired
63	Out of streams resources
64	Machine is not on the network
65	Package not installed
66	Object is remote
67	Link has been severed
68	Advertise error
69	Srmount error
70	Communication error on send
71	Protocol error
72	Multihop attempted
73	RFS specific error
74	Bad message
75	Value too large for defined data type
76	Name not unique on network
77	File descriptor in bad state
78	Remote address changed
79	Can not access a needed shared library
80	Accessing a corrupted shared library
81	.lib section in a.out corrupted
82	Attempting to link in too many shared libraries
83	Cannot exec a shared library directly
84	Invalid or incomplete multibyte or wide character
85	Interrupted system call should be restarted
86	Streams pipe error
87	Too many users
88	Socket operation on non-socket
89	Destination address required
90	Message too long
91	Protocol wrong type for socket
92	Protocol not available
93	Protocol not supported
94	Socket type not supported
95	Operation not supported
96	Protocol family not supported
97	Address family not supported by protocol
98	Address already in use
99	Cannot assign requested address
100	Network is down
101	Network is unreachable
102	Network dropped connection on reset
103	Software caused connection abort
104	Connection reset by peer
105	No buffer space available
106	Transport endpoint is already connected
107	Transport endpoint is not connected
108	Cannot send after transport endpoint shutdown
109	Too many references
110	Connection timed out
111	Connection refused
112	Host is down
113	No route to host
114	Operation already in progress
115	Operation now in progress
116	Stale file handle
117	Structure needs cleaning
118	Not a XENIX named type file
119	No XENIX semaphores available
120	Is a named type file
121	Remote I/O error
122	Disk quota exceeded
123	No medium found
125	Operation canceled
126	Required key not available
127	Key has expired
128	Key has been revoked
129	Key was rejected by service
130	Owner died
131	State not recoverable
132	Operation not possible due to RF-kill
133	Memory page has hardware error
```
The perror command explain error codes which is part of MySQL/MariaDB package:
```sh
perror 0
perror 1
```
### Conclusion

This page explained bash exit status and related commands. For more info see bash shell man page here or read it offline using the man command/info command or help command. For example:
```sh
man bash
info bash
help printf
help echo
```
