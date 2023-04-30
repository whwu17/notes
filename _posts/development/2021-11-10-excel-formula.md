---
title: Excel formulas for advanced calculation
categories: excel
tags: excel, office, formula, power query
author: Wu Wenhan
disable: latex
---

## Summation w/o pivot table

目标：统计M2单元格所表示的类别中，在第二行指定列的所有可能的分类汇总。

```excel
=IFERROR(LOOKUP(0,0/(COUNTIF($M$2:M3,IF(ISBLANK(OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,ROW_CNT,1)),OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,1,1),OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,ROW_CNT,1)))=0),IF(ISBLANK(OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,ROW_CNT,1)),OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,1,1),OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,ROW_CNT,1))),"")
```

### 框选函数

基本函数解释：
- 统计整行：`$2:$2`。
- MATCH(lookup_value, lookup_array, [match_type])函数：返回指定数值在指定数组区域中的位置，其中最后一个参数有三个值：-1（大于等于value的最小值）、0（严格等于）、1（小于等于value的最大值）。返回值从1开始。
- OFFSET(reference,rows,cols,height,width)函数：以指定的引用为参照系，通过给定偏移量得到新的引用（后四个参数均可为负数）。

例如：
- `[Range1]=OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,ROW_CNT,1)`，该函数从`A3`单元格开始，偏移至【M2单元格的值在第二行首次出现的单元格的位置】单元格的前一格，再框选出ROW_CNT\*1的矩形内的数据。由于`MATCH`函数返回值从1开始，而单元格偏移从0开始，因此需要-1。由此也可以看出，该函数的本质实际上是选中指定的某一列，这一列是`M2`单元格名字所规定的。
- 同理，`[Range2]=OFFSET($A$3,0,MATCH($M$2,$2:$2,0)-1,1,1)`指框选出1\*1的矩形，也就是与`M2`相同值的单元格。

### 有效元素提取函数

基本函数解释：
- `ISBLANK(value)`：判断是否为空。
- `IF(cond, true_stat, false_stat)`：条件语句。
- `COUNTIF(range，criteria)`：按标准进行选择。

例如：
- `[Range3]=IF(ISBLANK([Range1]),[Range2],[Range1])`，该函数用于检查`Range1`各元素是否为空，如果是则返回与M2单元格相同值，如果不是则返回该值本身不动。注意，`IF`语句在这里是分别提取了`Range1`和`Range2`中各自对应的一部分值，因此是数组模式公式，在Excel中采用`Ctrl+Shift+Enter`进行公式确认。确认后的公式会有一个大括号包裹住。
- `[Range4]=COUNTIF($M$2:M3,[Range3])`，该函数用于统计`[Range3]`中每个元素出现在M2至当前单元格的次数。`[Range3]`已经将所有的空值都转化成了列名，而`M2`又刚好是列名，因此该函数在统计`M2`出现次数时一定不为0（除非已经占满了元素，也就是`[Range2]`不存在任何空值）。（注意：该函数的输出是一个criteria长度的列，也就是说不是和M列长度一致，而是和匹配列一致。注意匹配顺序；就这个公式而言，该值只可能是0或1，因为M列的结果肯定不重复）

### 终止判定函数

基本函数解释：
- 在Excel中，`1=0`返回`False`，`0=0`返回`True`。`False`在运算中是`0`，`True`在运算中是`1`。`0/0=Error`，`0/1=0`。
- `LOOKUP(lookup_value,lookup_vector,result_vector)`函数：用于查找是否存在，并返回result_vector的对应offset的值。

在`=IFERROR(LOOKUP(0,0/([Range4]=0),[Range3]),"")`函数中，`LOOKUP`用于找到第一个0元素。而根据后面的判定条件，只有`Range4`中的统计量为0时（`0=0`，返回`True`，映射为1，`0/1=0`）才会返回0，其余均会返回`Error`。因此根据这个offset在Range3中找到指定的单元格，返回的值就是应当新增进M列的值了。最后的`IFERROR`函数，是当所有的统计值都统计完成后，会导致`LOOKUP`找不到0元素了，那么也会抛出`Error`错误，该函数捕捉这一错误并映射成空字符串即可。

> 再次说明，这是一个数组公式，因此需要使用`Ctrl+Shift+Enter`进行公式确认。


## Power Query M

如果需要跨表查询，甚至是跨工作簿查询。最高效的处理方式是通过Power Query M进行查找。Excel公式中的每一个查询都要指定好哪张表的哪个单元格，而该语言会动态检索产生的所有工作簿并进行合并。具体的文档可参考：<https://learn.microsoft.com/zh-cn/powerquery-m/quick-tour-of-the-power-query-m-formula-language>。

> 注意：该函数与日常语言完全不同，属于函数式语言。在代码过程中，全部的函数都是static的，也就是说，该语言不允许创建任何的对象，所有的对象都必须来源于函数的输出，类似Pipeline的思想。这与面向对象的编程语言差别较大，如果使用过Builder设计模式，或者Javascript的函数闭包，可能会与本语言类似。

```power-query-m
let
    // Pre: Extract all sheet names in workbook, except for the first one used to set the result of this query.
    #"Fetch File Path"=(Table.SelectRows(Excel.CurrentWorkbook(),each [Name]="FILE_PATH"){0}[Content])[Column1]{0},
    #"Source" = Excel.Workbook(File.Contents(#"Fetch File Path"),null,null),
    #"Extracted All Sheets" = Table.SelectRows(#"Source",each Text.Contains([Kind],"Sheet")),
    #"Extracted Sheet Names" = Table.SelectColumns(#"Extracted All Sheets",{"Name"}),
    #"Removed First Sheet" = Table.Skip(#"Extracted Sheet Names",1),
    #"Formatted as List"=Table.Column(#"Removed First Sheet","Name"),

    // Core: Generate the result of query
    Function = List.Transform(#"Formatted as List", (element)=> Table.Skip(Table.PromoteHeaders(Table.Skip(Source{[Item=element,Kind="Sheet"]}[Data],1),[PromoteAllScalars=true]),1)),
    #"Generated Statistical Table" = Table.Combine(Function),
    #"Summarized Columns" = List.Select(Table.ColumnNames( #"Generated Statistical Table" ), (x)=>Text.Contains(x,"_1")),
    #"Type Transform" = List.Transform(#"Summarized Columns", (x)=>{x, type text}),
    #"Merged Columns" = Table.CombineColumns(Table.TransformColumnTypes(#"Generated Statistical Table", #"Type Transform"),#"Summarized Columns",Combiner.CombineTextByDelimiter("", QuoteStyle.None),"分类项"),

    // Post: Remove other columns and blank rows, group by the first column and rename the column for user-friendly.
    #"Selected Required Columns" = Table.SelectColumns(#"Merged Columns",{"需要输出的字段"}),
    #"Removed Blank Rows" = Table.SelectRows(#"Selected Required Columns", each not List.IsEmpty(List.RemoveMatchingItems(Record.FieldValues(_), {"", null})) ),
    #"Grouped Rows" = Table.Group(#"Removed Blank Rows", {"输出字段1"}, { {"输出字段2", each List.Sum([输出字段2]), type number} })
in
    #"Grouped Rows"
```

> M 是区分大小写的语言。

首先，所有的写法都应遵循`let ... in ...`结构。其中，`in`后面紧跟着输出到Excel的Table，`let`用于创建函数式流程。

所有的函数均可查询相关API，基本思路是提取当前工作簿的所有Sheet，并移除第一张表用于放总结信息的表。对其余所有表，创建一个函数该函数用于对上述每张表的数据去除前三行（其中第二行提升为列名），并combine到一张表中。最后，将其中有用的类目进行合并整理得到。

### 基本概念
#### Table

有行有列即为table。

创建Table：`Table = #table({字段名},{ {行数据},{行数据} })`
– 字段名相当于是行标题
– 行数据，相当于一行的数据

例：`A = #table({"产品","数量"},{ {"a",10},{"b",20} })`

#### Record

record就是相当于table中的一行，凡是带\[\]的都和record有关。

构建Record：`Record = [字段名=值]`

例：`= [a=1,b=2]`

注1：[a=1,b=2,……][a]代表提取记录中a字段名所对应的值。
注2：Record的嵌套：字段值为记录/序列时，就形成了嵌套。

#### List
list相当于table中的不带字段名的一列，凡是带{}的都和list有关。

构建List：`List = {值}`

例1：`={"a","b"}`

例2：`={1..10}`

注：List是有序的，根据索引号找到的值是唯一的。


#### 不同数据结构之间的转换
|函数名|解释|
|---|---|
|Table.ToRows|转换成行的list表格|
|Table.FromRows|从多行list创建表格|
|Table.ToColumns|转换成列的list表格|
|Table.FromColumns|从多列list创建表格|
|Table.ToRecords|转换成记录表|
|Table.ToList|使用指定符号合并成list列表|
|Table.FromList|从list创建表格|
|Table.FromRecords|从Record创建表格|
|Table.FromValue|从值创建表格|
|Table.Column|返回表格指定列的list列表|
|Table.ColumnNames|返回表格的列名称list列表|
|Record.FieldValues|返回记录中字段值的list列表|
|Record.FieldNames|返回记录中字段名称的list列表|
|Record.SelectFields|返回记录中的指定列记录|
|Record.FromTable|Table转换成Record|
|Record.FromList|List转换成Record|
|Record.ToTable|Record转换成Table|
|Record.ToList|Record转换成List|


