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
          <ps-circle size="s"></ps-circle>
        </div>
        <p>
          <ps-block style="width: 230px; height: 10px; margin-top: 30px;"></ps-block>
        </p>
        <p>
          <ps-block style="width: 200px; height: 10px;"></ps-block>
        </p>
      </div>
      <p>
        <ps-text line="2" line-height="10" style="width: 300px;"></ps-text>
      </p>
    </div>
  </placeholder-shimmer>
```

![screenshot](https://user-images.githubusercontent.com/2475044/28693339-88b6817a-72fa-11e7-97b4-47dcd7ca22db.png)

### Customization

#### Custom colors

It's suportted custom labels by Provider property:

|   property       |          default value             |
| ---------------- | ---------------------------------- |
| color     | `'#E2E2E2'` |
| hgcolor   | `'#F2F2F2'` |

```js
app.config(function(psConfigProvider){
  psConfigProvider.color='red'
  psConfigProvider.hgcolor='blue'
})
```

### Demo

#### Bootstrap
![bootstrap-optimized](https://user-images.githubusercontent.com/2475044/28689869-7e7592d0-72ed-11e7-85a8-67e466a4a365.gif)

#### Angular Material
![angular-optimized](https://user-images.githubusercontent.com/2475044/28689868-7e71196c-72ed-11e7-9b4a-6bf2f4b6ab8b.gif)

### License

MIT License
