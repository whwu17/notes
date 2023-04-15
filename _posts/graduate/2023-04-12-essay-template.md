---
layout: post
title: Graduated-related sites and materials
categories: Postgraduate
tags: [essay, graduate]
author: Wu Wenhan
---


## 毕业论文模板

原始的毕业论文模板（2022届）可于<a href="/notes/assets/essay-template-old.zip">此处</a>下载。这一模板由B1008实验室2022届学长提供，并通过了全部论文审核，特别表示感谢。

在原模板的基础上，2023级的论文模板进行了以下改动：
- 目录中应包括摘要、图表目录等信息
- 图表目录取消默认的左边距
- 多行标题中标题的间距过小
- 由于论文终稿是双面打印，因此根据规定需要将页面放置在书籍的右下角（因此奇偶页位置不同）
- 由于latex自动生成的参考文献格式较难修改，将参考文献转为手写完成，避免自动生成的文献中的标点中英文错误，格式错误等
- 参考文献的间距过大，导致尽管页数很多，但看上去依旧像是没引用多少的样子
- 盲审、查重、终稿均有不同的要求（且要求十分混乱），将原来的盲审开关调整为盲审和查重开关，并放在页面最上方，一键调整
- 删掉了一些没有必要的代码
- 还有记不起来的其余改动

在上述的改动后，最新的模板已经由本人在overleaf上开源，如果需要在overleaf（推荐）上使用这一模板，可以进入该链接直接生成：
<https://www.overleaf.com/latex/templates/hua-dong-shi-fan-da-xue-shuo-shi-lun-wen-mo-ban-2023/ctvnwyqtsbbz>

请务必阅读readme.md文件。该模板适用于2023届软件工程学院学术型硕士，不同学院、专业、学位均有不同，请提前咨询！（在2023届中，即使是学硕和专硕，要求也有较大差异）

> 特别提示：请提前咨询查重论文是否允许pdf版本，部分学位仅支持word提交，因此不适用该模板，请自行寻找word毕业论文模板！

此外，在GitHub上还能找到很多的开源毕业论文模板。推荐其中的一个：<https://github.com/ECNU-ICA/ECNU_graduation_thesis_template>。

如有需要可进入下载。

## 公式编写

在Latex的编写过程中，公式的编辑不具备实时预览的效果，且公式的代码技巧也较多。如果每次都要保存和调试以显示公式是否存在问题，是十分影响论文的写作体验的。对于这一现象，目前没有最好的解决方法，但可以使用以下方式缓解这一现象：

- 在以下网站渲染Latex公式，并复制到论文中：<https://www.latexlive.com/>

- 在Word中使用公式编辑器撰写公式，并通过工具生成Latex公式，再复制到论文中。LaTex和MathML的转换工具链接：<https://johnmacfarlane.net/texmath/>

注意：在Word中要想正确复制公式，需要在设置中将公式格式转为MathML格式，而不是线性模式，如下图所示。

{% include img-path.html path="mathml-settings.png" %}

- 手写或在网络上找到相应的公式，截图并使用图片转公式的方式完成。推荐的工具有Mathpix Snipping Tool，每个账号可以识别10张图片，单张图片中包括的公式不限。因此，将所有待识别的公式放入同一张图中，进行识别；或者多账号注册直至所有公式识别完成。

如果有更好的方式，可在评论区留言。

## 查重

收费的查重方式较多，不做列举。由于目前知网开放了研究生个人查重（<https://cx.cnki.net/#/login>），因此也无需再通过其它收费方式进行查重。以下介绍免费的查重方式，在使用知网前，通过免费查重的报告降重，可以最大程度的利用知网的结果进行改善，避免低级错误。

- 超星大雅（<http://user.dayainfo.com/>）：使用学习通账号可以有一次免费查看报告的机会。其余情况每天可查重五次，但仅能看到数字，无法看到报告。该查重结果较高，原因是参考文献不一定能全部识别，未识别的参考文献因此重复。此外，所有的页眉“华东师范大学硕士学位论文”和原创性声明会被标记重复（即使是知网也会标记重复，但不会每页都标，具体算法未知）。特别提醒，该网站的结尾是'.com'，不是'.info'，后者是假冒网站。
- 万方：学信网账号可免费查重一次。据传（未亲测），比例较低，有部分文献无法查到。

总之，先免费查重，再前往知网进行付费查重。

## 该模板中的参考文献

一般来说，参考文献都应该采用bst文件格式。该文件格式采用key-value的方式进行编写，样例如下：
```bst
@inproceedings{DBLP:conf/cvpr/00010C00022,
  author       = {Yikai Wang and
                  Xinghao Chen and
                  Lele Cao and
                  Wenbing Huang and
                  Fuchun Sun and
                  Yunhe Wang},
  title        = {Multimodal Token Fusion for Vision Transformers},
  booktitle    = {IEEE/CVF Conference on Computer Vision and Pattern Recognition,
                  {CVPR} 2022, New Orleans, LA, USA, June 18-24, 2022},
  pages        = {12176--12185},
  publisher    = {{IEEE}},
  year         = {2022},
  url          = {https://doi.org/10.1109/CVPR52688.2022.01187},
  doi          = {10.1109/CVPR52688.2022.01187},
  timestamp    = {Wed, 07 Dec 2022 23:06:29 +0100},
  biburl       = {https://dblp.org/rec/conf/cvpr/00010C00022.bib},
  bibsource    = {dblp computer science bibliography, https://dblp.org}
}
```
理论上，在每一个entry书写完成后，latex会自动按照格式进行排版，生成正确的参考文献格式。在实际编写中，有时候会出现个别字段由于key不同、key缺失、key冲突等原因，无法正确的显示参考文献。这在通常情况下不会成为问题。但毕业论文对格式（包括每一条参考文献的格式）的要求通常较高。同时，由于latex所见非所得的特性，每一条bst都需要经过编译才能检查其是否被正确渲染。如果字段缺失，还需要找到相应的key，方能修改为正确的格式。

上述两点原因使得新的模版不再使用通常的bst格式，而是回归到了latex最原始的bib格式。在该格式下，输入的文字即为最终的输出，无需再次编译即可在代码栏看到最终的样式。该格式在format.cls的修订后隐藏了未引用的文献，并自动按文献在正文中出现的顺序进行编号。为了支持上述特性，每一个bibitem后面都要严格接两个大括号，第二个不能省略（如果不需要这两个特征则一般可以省略第二个大括号）。

此外，如果希望很长的url可以在行尾溢出时自动换行，而不是独占一行，请在url外加上url()，例如：
```bib
\bibitem{ref}{authors. bb站. url(www.bb.com).}
```
而不是：
```bib
\bibitem{ref}{authors. bb站. www.bb.com.}
```
每一条参考文献的手写显然是影响论文的工作效率的。因此，可采用第三方文献工具的导出功能。例如，Mendeley软件支持以GB/T格式输出。通过复制粘贴的方式就可以获得大体正确的文献格式。可以在该基础上进行任何程度的微调，并最终放入论文的参考文献中。

考虑到兼容性，模版保留了传统模式的参考文献，可通过选项进行切换。在bst格式中，需要使用key-value的方式进行填入，与其余毕业论文模版保持一致。

## 写在最后

有关LaTex的相关说明可前往以下的文章中查看：
{% for post in site.posts %}
 {% if post.title contains 'LaTeX' %}
 <a href="{{post.url | relative_url }}">{{post.title}}</a>
 {% endif %}
{% endfor %}


毕业论文的编写是十分漫长且痛苦的，因此适当的分散注意力有助于调整心情。最后，祝所有看到本文的人都能顺利毕业~也包括我自己~



