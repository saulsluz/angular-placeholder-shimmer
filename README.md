# angular-placeholder-shimmer

A placeholder shimmer for angular applications (^1.x.x).

it supports [Bootstrap](https://getbootstrap.com/) (^3.x.x) and [Angular Material](https://material.angularjs.org/) (^1.x.x).

### Installation

#### Bower

`$ bower install angular-placeholder-shimmer`

Embed it in your HTML:

```html
<script src="./bower_components/angular-placeholder-shimmer/js/placeholder-shimmer.js"></script>
<link rel="stylesheet" href="./bower_components/angular-placeholder-shimmer/css/placeholder-shimmer.css">
```

#### NPM

`$ npm install angular-placeholder-shimmer`

Embed it in your HTML:

```html
<script src="./node_modules/angular-placeholder-shimmer/js/placeholder-shimmer.js"></script>
<link rel="stylesheet" href="./node_modules/angular-placeholder-shimmer/css/placeholder-shimmer.css">
```

#### Dependency injection

Inject `angular-placeholder-shimmer` module as a dependency into your app:

```js
var app = angular.module('app', [
  'ngPlaceholderShimmer'
])
```

### Usage

### The directives

The isolated scope binding:

#### ps-circle

|          property      |             values           | required |
| ---------------------- | ------------------------------------- | -------- |
| size                   |           `'s'`,`'m'` or `'l'`        |   yes    |
| style                  | Any css property valid for canvas tag |          |

#### ps-square

|          property      |             values           | required |
| ---------------------- | ------------------------------------- | -------- |
| size                   |           `'s'`,`'m'` or `'l'`        |   yes    |
| style                  | Any css property valid for canvas tag |        |

#### ps-block

|          property      |             values           | required |
| ---------------------- | ------------------------------------- | -------- |
| style                  | Any css property valid for canvas tag |        |

#### ps-text

|          property      |             values           | required |
| ---------------------- | ------------------------------------- | -------- |
| line                   | Number of lines (`integer`) |     yes     |
| line-height            | Height of each line (`integer`px) |     yes     |


#### Sample

This plugin have three primitive types of shape:

- Circle: to draw a circle
- Square: to draw a square
- Block: to draw any type of block (squares or rectangles)

An abstracte type:

- Text: a wrap of block type to produce lines of text like paragraphs

All components must be wrapped by placeholder-shimmer tag.

```html
<placeholder-shimmer>
  <div style="padding: 10px; margin: 10px;">
    <div>
      <div style="float:left">
        <ps-square size="s"></ps-square>
      </div>
      <p>
        <ps-block style="width: 230px; height: 7px; margin-left: 10px; margin-top: 10px;"></ps-block>
      </p>
      <p>
        <ps-block style="width: 200px; height: 7px; margin-left: 10px;"></ps-block>
      </p>
    </div>
    <p style="padding-top: 3px;">
      <ps-text line="2" line-height="7" style="width: 300px; "></ps-text>
    </p>
  </div>
</placeholder-shimmer>
```

![screenshot](https://user-images.githubusercontent.com/2475044/28840183-966a875a-76cc-11e7-8cb6-2bbe2543ccee.png)

### Customization

#### Custom colors

It's suportted custom labels by Provider property:

|   property       |          default value             |
| ---------------- | ---------------------------------- |
| color     | `'#EFEFEF'` |

```js
app.config(function(psConfigProvider){
  psConfigProvider.color='red'
})
```

### License

MIT License
