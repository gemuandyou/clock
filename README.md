# clock
一个Canvas时钟

## 使用说明

1. 引入JS文件

   ```html
   <script src="clock.js"></script>
   ```

   

2. 调用draw函数生成时钟

   ```javasc
   Clock.draw(element, options);
   ```

>
> ### element
>
> 需要生成时钟的HTMLCanvasElement类型元素。是一个`<canvas>` HTML节点。
>
> ### options
>
>- `lineWidth` 时钟圆形边框的宽度
>
>- `lineColor` 使用圆形边框的颜色
>
>- `type` 时钟指针类型。值为1~2
>
>- `showDigital` 是否显示数字时间
>
> ### 示例
> ```html
><canvas id="clock" width="500" height="500" style="background-color: antiquewhite">浏览器不支持Canvas</canvas>
><script src="clock.js"></script>
><script>
>    Clock.draw(document.getElementById('clock'), {
>        lineWidth: 10,
>        lineColor: '#ccc',
>        type: 2,
>        showDigital: false
>    });
></script>
> ```



