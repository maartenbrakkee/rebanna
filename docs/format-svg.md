# Correctly formated SVG's

Currently _Rebanna_ works with a maximum of 6 different color layers. Each layer should be grouped and each group should have an id.

## Example

```SVG
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 22.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve">
  <style type="text/css">
  	.shadow_light{opacity:0.11;fill:#3D3D3C;}
  	.shadow_dark{opacity:0.22;fill:#3D3D3C;}
  	.color{fill:#DC5040;}
  	.color_alt_light{fill:#FFFFFF;}
  	.color_alt_dark{fill:#3D3D3C;}
  	.color_shadow{opacity:0.5;fill:#DC5040;}
  </style>
  <g id="color">
  	<circle class="color" cx="100.4" cy="99.6" r="85"/>
  </g>
  <g id="shadow_dark">
  	<path class="shadow_dark" d="M179.2,99.6c0,43.5-35.3,78.8-78.8,78.8s-78.8-35.3-78.8-78.8h23.2c0,0,19.8-4.6,54.6-4.6
  		s53.9,4.6,53.9,4.6H179.2z"/>
  </g>
  <g id="color_shadow">
  	<path class="color_shadow" d="M89.8,138.9c-20.5-0.4-27.5-0.7-31.8-1.6c-2.9-0.6-5.4-1.9-7.3-3.8c-1.4-1.4-2.6-3.6-3.5-6.7
  		c-0.8-2.5-1.1-4.6-1.5-9.8c-0.6-11.6-0.8-21.1,0-31.8c0.7-5.9,1-12.8,5.4-16.9c2.1-1.9,4.5-3.1,7.2-3.6c4.2-0.8,22.2-1.4,40.8-1.4
  		c18.6,0,36.6,0.6,40.8,1.4c3.4,0.6,6.5,2.5,8.4,5c4,6.3,4.1,14.1,4.5,20.2c0.2,2.9,0.2,19.5,0,22.4c-0.6,9.7-1.1,13.1-2.6,16.6
  		c-0.9,2.2-1.6,3.4-3,4.7c-2.1,2-4.7,3.4-7.5,3.8C122,138.9,106.9,139.2,89.8,138.9L89.8,138.9z"/>
  </g>
  <g id="color_alt_light">
  	<path class="color_alt_light" d="M127.1,96.1c-16-8.5-31.2-16.4-46.9-24.6v49C96.7,111.5,114,103.4,127.1,96.1L127.1,96.1
  		L127.1,96.1z"/>
  </g>
  <g id="shadow_light">
    <path class="shadow_light" d="M127.1,96.1c-16-8.5-46.9-24.6-46.9-24.6l41.2,27.7C121.5,99.2,114,103.4,127.1,96.1L127.1,96.1z"/>
  </g>
  <g id="color_alt_dark">
  	<path class="color_alt_dark" d="M100.4,28.6c39.1,0,71,31.9,71,71s-31.9,71-71,71s-71-31.9-71-71S61.2,28.6,100.4,28.6 M100.4,14.6
  		c-46.9,0-85,38.1-85,85s38.1,85,85,85s85-38.1,85-85S147.3,14.6,100.4,14.6L100.4,14.6z"/>
  </g>
</svg>
```
