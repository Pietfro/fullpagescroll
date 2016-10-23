#fullpagescroll.js

Create full page scrollable sections with ease!

##Features
- lightweight
- customizable
- pure js
- supports touch events
- support for multiple instances
- supports scrollable containers

##Installation

download js and css into your project and link it.

```html
<script type="text/javascript" src="./fullpagescroll.js"></script>
<link rel="stylesheet" type="text/css" href="./fullpagescroll.css">
```

##Usage

```html
<div class="pages">
	<section>
		<div>Page 1</div>
	</section>
	<section>
		<div>Page 2</div>
	</section>
	<section>
		<div>Page 3</div>
	</section>
</div>
```
and then create a new instance

```javascript
new fullpagescroll(selector);
```

Note that each section needs to contain a content wrapper as its only child. Reason for that is to allow to scroll when content's height is greater than window's height.

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

Concept based on https://github.com/peachananr/purejs-onepage-scroll
