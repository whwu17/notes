---
layout: post
title: LaTeX Notes, including figures and tables
categories: Postgraduate
tags: [graduate]
author: Wu Wenhan
---

## LaTeX公式正体

公式移除斜体可使用以下命令：`{rm words_not_italics}`。

## LaTeX的图表绘制

在LaTeX中，所有的文件都是通过代码+编译完成的。这使得其编写难度有大幅提升。本节可帮助LaTeX用户更好的使用这一功能。

### 表格
在LaTeX中，表格的编写是较为困难的，特别是第一个表格的编写。在大多数模版（包括毕业论文模板）中，会预留一个表格示例，如下：
```LaTeX
\begin{table}[!htb]
    \caption{标题}
    \label{tag}
    \centering
    \begin{tabular}{ccc} 
    \hline
    A & B & C \\
    \hline
    a & b & c \\
    a & b & c \\
    a & b & c \\
    \hline
    \end{tabular}
\end{table}
```

如果需要探索更多的表格代码，可前往以下网站，进行对应的表格生成：<https://tablesgenerator.com>

### 图片
与表格一样，图片的插入代码同样已经在毕业论文模版中给出。大多数的模板也会给出标准代码，如下：
```LaTeX
\begin{figure}[!htb]
	\centering
	\includegraphics[width=4.5in]{path/to/figure.png}
	\caption{标题}
	\label{tag}
\end{figure}
```
图片需要在绘制后上传原始文件到overleaf中再进行引用，不支持类似word的copy-paste的使用方式。

### 位置标签
在图片和表格代码中，通常使用中括号表明图片的位置。推荐使用`[!htb]`作为图片的放置代码，其可接受参数如下：
- `h`：here，代表就地放置，不改变图片相对文本的顺序。
- `t`：top，代表放在该页的顶部。
- `b`：bottom，代表放在页面的底部。
- `p`：page，代表这张图片单独成一页（因此不推荐这一参数）。
- `!`：代表其后面紧跟的字母仅为尝试放置，而非强制放置。在该符号下如果无法放置，则顺位采用下一个字母放置图片。没有该符号可能导致格式错误。（例如：使用`p`而非`!p`时，如果图片无法在当前页放置，则会拉长前一页的行间距以保证图片是就地放置的。这可能导致图片前的文字间距过大。）

### 作图工具

在论文中，最好用的作图工具是PowerPoint。除了PPT作图外，还有很多手绘图工具，例如：
- ProcessOn：在线编辑图，可转为任意图片格式下载，链接：<https://www.processon.com/>。
- Visio：Office配套软件，专业的图片绘制工具。

此外，还有很多可视化的图表绘制工具，例如：
- matplot：Python的专业绘图软件，可在Jupyter Notebook中在线渲染，并自动配色。
- plot：R语言作为数据分析的专业语言，其在数据处理方面的能力，以及可定制化上有较好的表现。通常，图表比matplot的风格更为学术。
- origin：学术领域指定的专用绘图软件。与Matlab类似，该软件常用于模拟实验类的理工科专业（例如化学、电气等）。其对表格的处理和低代码的设计，使其较为广泛的使用。然而，对计算机相关专业而言，其功能可能过于强大。很多模拟功能无需使用，UI界面和生成的图像的美观性也较差，但不失为强大的模拟和绘图工具。

## 数学公式的代码格式
### 常用的数学公式格式
常用的数学公式的代码格式一共有两种，LaTeX和UnicodeMath。

LaTeX是Leslie Lamport于1986年基于Tex演化的宏语言。TeX是Donald E. Knuth于1978年提出的排版语言，其专业简洁的特性使得用户易于学习其中的功能，并能轻松排版适合的格式效果。

UnicodeMath是由Murray Sargent III于2006年提出的轻量化数学标记语言，该语言最初版本可于[此处](https://www.unicode.org/notes/tn28/UTN28-PlainTextMath.pdf)查看。相较于LaTeX语言，该语言采用Unicode表达所有的公式元素，并更接近人类的描述风格。

相较于LaTeX，UnicodeMath的书写风格更适合输入。例如：$\frac{a}{b}$在LaTeX中需要输入`\frac{a}{b}`，而在UnicodeMath中仅需要输入`a/b<space>`即可。然而，由于Unicode对所有的数学符号都进行了编码，因此包括了大量键盘上无法表示的符号，使得其难以运用。例如：U+220A表示$\in$符号，然而LaTeX中仅需输入`\in`三个字符。

将上述两种风格结合，通过对UnicodeMath中键盘不可写的字符进行LaTeX转义，同时保留UnicodeMath的输入模式，即可得到Word中公式编辑器的使用方法。你可以在Word上方的“Equation选项组--Conversions选项卡--小箭头--Math AutoCorrect...按钮”中找到所有的Unicode字符到键盘可输入字符的转换（大多数直接使用LaTeX中的格式完成的，例如所有的罗马字母$\alpha$，使用`\alpha`进行转义）。目前，最新的Word同时支持LaTeX和UnicodeMath输入模式，但是对于Word2016前的版本不支持。同时，对盗版（例如通常都会用的KMS激活）的Word2016后的版本该选项点击后没有任何的反应。因此如果想要使用Word中的LaTeX，必须使用官方正版。

对于如何使用Word中的公式编辑器，参考该文章即可（大多数与LaTeX完全一致，除了随时出现的反人类的`{}`换成了`<space>`）：<https://zhuanlan.zhihu.com/p/393384688>。

综上，Word中使用UnicodeMath为（默认）公式语言，而LaTeX中使用Tex为公式语言。两者在公式编辑中部分相似，但仍有区别，因此需要进行转换。另外，除了UnicodeMath和LaTeX，还有其他公式处理格式，例如MathType的OpenMath。

### MathML与LaTeX

MathML是万维网联盟（W3C）于1998年提出的用于解决数学专业中符号以及表达式的存储、显示、交换和管理等问题的XML语言。该语言已经成为HTML5官方支持的语言，并被所有主流浏览器（Chrome、Safari、Firefox等）支持。同时，该语言已经在HTML5、EPUB3、DAISY、DITA、NLM/JATS和许多其他发布标准上定义数学。

与LaTex相比，各自的特征如下：

- 应用领域：LaTeX适用于学术文章、书籍、报告、书信、幻灯片等排版，而MathML仅限于数学公式。
- 格式：MathML符合XML文档的语法结构，LaTeX符合Tex定义的语法。
- 书写风格：MathML的结构化程度较高，且包括了内容和呈现两种类型的标记，LaTeX仅由呈现型的标记组成。





### MathML的优点与缺点

MathML有很多优势。例如：
- 其充分的结构化使得其适合SEO优化，同时支持文本朗读、盲人相关的辅助功能等。
- 与LaTeX相比，MathML的语义信息更为明确，因此创建处理MathML的解析器也较容易。
- XML标记的链接功能比LaTeX的交叉引用功能更富于表现力，因此内嵌在HTML中，MathML的结构化文本比纯文本更容易被搜索引擎识别。
- MathML可以使用JavaScript的所有特性，例如`getElementByTagName()`对页面元素的提取等，甚至自定义css样式，从而深度与HTML结合。

然而，MathML的不足之处也很明显。例如，MathML继承了XML冗长的标签格式，这使得其几乎是不可写的。如果使用MathML语言表达单变量x，最简代码如下：
```XML
<math><mi>x</mi></math>
```
由于其代码极为繁琐冗长，目前大多数的MathML也都是通过计算机自动生成的，这与MathType（旧版Word公式编辑器）对公式的创建和编辑一致。同时，目前的网页渲染通常也是通过MathJax将用户编写的LaTeX代码转换成MathML格式，再经过浏览器内置的HTML5渲染完成。

目前，基本所有的格式都可以（通常是由开源组织或官方）通过模型交换和对应工具转化为MathML。

注意：MathML除了呈现型标记，还有（可选的）内容型标记，并通过`<annotation>`标签展示公式在文本朗读结构、LaTeX结构、图像结构等代码。例如，对x^2+y这一公式的MathML标记如下：
```XML
<math>
    <semantics>
        <!-- Presentation MathML -->
        <mrow>
            <msup>
                <mi>x</mi>
                <mn>2</mn>
            </msup> 
            <mo>+</mo> 
            <mi>y</mi>
        </mrow>
        <!-- Content MathML -->
        <!-- Speech Accessibility Annotation (Similar to Functional Programming) -->
        <annotation-xm1 encoding="MathMI-Content"> 
            <apply>
                <plus/> 
                <apply>
                    <power/> 
                    <ci>x</ci>
                    <en type="integer">2</en> 
                </apply>
                <ci>y</ci>
            </apply> 
        </annotation-xml>
        <!-- Figure Annotation -->
        <annotation encoding="image/png" src="path/to/this/formula.png"/>
        <!-- LaTeX Annotation -->
        <annotation encoding="application/x-tex"> x^{2} + y </annotation>
    </semantics>
</math>
```




