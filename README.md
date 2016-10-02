#fullpagescroll.js

This is a small script to create full page sections that you can scroll between.
Concept based on https://github.com/mystika/onepagescroll

##Features
- lightweight
- customizable
- npure js
- support touch events
- support for multiple instances

##Installation

download js and css into your project and link it.

```html
<script type="text/javascript" src="./fullpagescroll.js"></script>
<link rel="stylesheet" type="text/css" href="./fullpagescroll.css">
```

##Usage

you only need single parent element and some child elements.

```html
<div class="pages">
	<section>PAGE ONE</section>
	<section>PAGE TWO</section>
	<section>PAGE THREE</section>
	<section>PAGE FOUR</section>
</div>
```

and then create a new instance

```javascript
new fullpagescroll(selector);
```


##Options(Attributes)
```javascript
new fullpagescroll(selector,{
  pageContainer: 'section',     //child elements selector. use if you don't want to use section for page.
  animationType: 'ease-in-out', //determine css3 animation that will run when page changes
                                //ex) 'ease', 'ease-out-in', 'cubic-bezier(0.2, 0.75, 0.5, 1.15)'
  animationTime: 500,           //define how long each page takes to animate, 0 for off
  infinite: true,               //back to the last/first page when you scroll at first/last page
  pagination: true,             //set show or hide pagination element.
  keyboard: true,               //allow up/page-up and down/page-down key for page scroll
  direction: 'vertical'         //determine direction of page scroll. options available are 'vertical' and 'horizontal'
});
```
