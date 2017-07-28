# angular-placeholder-shimmer

A placeholder shimmer for angular applications (^1.x.x).

it support [Bootstrap](https://getbootstrap.com/) (^3.x.x) and [Angular Material](https://material.angularjs.org/) (^1.x.x).

### Installation

#### Bower

`$ bower install angular-placeholder-shimmer`

Embed it in your HTML:

```html
<script src="./bower_components/angular-placeholder-shimmer/dist/placeholder-shimmer.min.js"></script>
```

#### npm

`$ npm install angular-placeholder-shimmer`

Embed it in your HTML:

```html
<script src="./node_modules/angular-placeholder-shimmer/dist/placeholder-shimmer.min.js"></script>
```

#### CDN

Provided by [RawGit](https://rawgit.com/):

```html
<script src="https://cdn.rawgit.com/saulsluz/angular-placeholder-shimmer/594a8fe7/js/placeholder-shimmer.js"></script>
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
| style                  | any css's property valid for canvas tag |          |

#### ps-square

|          property      |             values           | required |
| ---------------------- | ------------------------------------- | -------- |
| size                   |           `'s'`,`'m'` or `'l'`        |   yes    |
| style                  | any css's property valid for canvas tag |        |

#### ps-block

|          property      |             values           | required |
| ---------------------- | ------------------------------------- | -------- |
| style                  | any css's property valid for canvas tag |        |

#### ps-text

|          property      |             values           | required |
| ---------------------- | ------------------------------------- | -------- |
| line                   | Number of lines `integer` |     yes     |
| line-height            | Height of each line `integer`px |     yes     |


#### Sample

This plugin have three primitive types of shapes:

- Circle: to draw an circle
- Square: to draw an square
- Block: to draw any type of block (squares or rectangles)

An abstracte type:

- Text: a wrap of block type to produce lines of text like paragraphs

All of components must be wrapped by placeholder-shimmer tag.

```html
  <placeholder-shimmer>
    <div style="border: 1px solid #CCC; padding: 10px; margin: 10px;">
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

![screenshot](https://user-images.githubusercontent.com/2475044/28717979-585f4e8c-737a-11e7-9342-2381a1a0a91d.png)

### Customization

#### Custom colors

It's suportted custom labels by Provider property:

|   property       |          default value             |
| ---------------- | ---------------------------------- |
| color     | `'#EFEFEF'` |
| hgcolor   | `'#F6F6F6'` |

```js
app.config(function(psConfigProvider){
  psConfigProvider.color='red'
  psConfigProvider.hgcolor='blue'
})
```

### Demo

#### Bootstrap

![bootstrap](https://user-images.githubusercontent.com/2475044/28719076-025985d4-737f-11e7-8b0e-6bd5f208a144.gif)

#### Angular Material

![material](https://user-images.githubusercontent.com/2475044/28719075-02534002-737f-11e7-9de8-948b2ad7c221.gif)

### License

MIT License
