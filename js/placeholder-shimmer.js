(function () {

  angular.module('ngPlaceholderShimmer', [])

    .provider('psConfig', function () {
      this.color = "#EFEFEF"
      this.timeout = 60
      this.$get = function () {
        return this
      }
    })

    .controller('psCtrl', ['psConfig', '$scope', function (psConfig, $scope) {
      $scope.draw = function draw(shape) {
        switch (shape) {
          case 'circle':
            {
              $scope.ctx.strokeStyle = psConfig.color
              $scope.ctx.fillStyle = psConfig.color
              $scope.ctx.arc($scope.a, $scope.b, $scope.c, 0, (2 * Math.PI), false)
              $scope.ctx.fill()
              $scope.ctx.stroke()
            }
            break;
          case 'square':
            {
              $scope.ctx.fillStyle = psConfig.color
              $scope.ctx.fillRect(0, 0, $scope.h, $scope.h);
            }
            break;
          case 'block':
            {
              $scope.ctx.fillStyle = psConfig.color
              $scope.ctx.fillRect(0, 0, $scope.width, $scope.height);
            }
            break;
          default:
            {
              throw new Error('unknow type of shape')
            }
        }
      }
    }])

    .directive('placeholderShimmer', ['psConfig', '$interval', '$timeout', function (psConfig, $interval, $timeout) {
      return {
        controller: 'psCtrl',
        restrict: 'E',
        scope: {},
        link: function (scope, tElement) {

          var jqCanvas;
          
          function process() {
            jqCanvas.addClass('shimmer-opacity')
            return $timeout(function () {
              jqCanvas.removeClass('shimmer-opacity')
            }, 600)
          }

          function run() {
            $interval(function(){
              process()
            },1500, (psConfig.timeout*1000)/1500)
          }

          $timeout(function(){
            if(!jqCanvas) jqCanvas = angular.element(tElement).find('canvas')
            if(!jqCanvas.hasClass('shimmer-transition')) jqCanvas.addClass('shimmer-transition')
            run()
          },50)

        }
      }
    }])

    .directive('psText', ['psConfig', function (psConfig) {
      return {
        require: '^placeholderShimmer',
        controller: 'psCtrl',
        restrict: 'E',
        scope: {
          line: '@',
          lineHeight: '@'
        },
        template: '<div><p ng-repeat="i in lines"><ps-block style="width:100%; height: {{ lineHeight }}px;"></ps-block></p></div>',
        link: function link(scope, tElement) {

          scope.lines = []
          for (var x = 0; x < scope.line; x++) {
            scope.lines.push(x)
          }

        }
      }
    }])

    .directive('psCircle', ['psConfig', function (psConfig) {
      return {
        require: '^placeholderShimmer',
        controller: 'psCtrl',
        restrict: 'E',
        scope: {
          size: '@',
          style: '@?'
        },
        template: '<canvas style="{{ style }}"></canvas>',
        link: function link(scope, tElement) {

          var jqCanvas = angular.element(tElement).find('canvas')

          switch (scope.size) {
            case 's':
              {
                scope.a = 30
                scope.b = 30
                scope.c = 30
                scope.w = 70
                scope.h = 70
              }
              break;
            case 'm':
              {
                scope.a = 40
                scope.b = 40
                scope.c = 40
                scope.w = 90
                scope.h = 90
              }
              break;
            case 'l':
              {
                scope.a = 60
                scope.b = 60
                scope.c = 60
                scope.w = 130
                scope.h = 130
              }
              break;
            default:
              {
                throw new Error('unknow size')
              }
          }
          jqCanvas.attr('width', scope.w)
          jqCanvas.attr('height', scope.h)

          var canvas = angular.element(tElement).find('canvas')[0]
          if (!canvas.getContext) throw new Error('canvas not supported')

          scope.ctx = canvas.getContext("2d")
          scope.ctx.beginPath()

          //define the colour of the circle
          scope.ctx.lineWidth = 1

          scope.draw('circle')
        }
      }
    }])

    .directive('psSquare', ['psConfig', function (psConfig) {
      return {
        require: '^placeholderShimmer',
        controller: 'psCtrl',
        restrict: 'E',
        scope: {
          size: '@',
          style: '@?'
        },
        template: '<canvas style="{{ style }}"></canvas>',
        link: function link(scope, tElement) {


          var jqCanvas = angular.element(tElement).find('canvas')

          switch (scope.size) {
            case 's':
              {
                scope.h = 50
              }
              break;
            case 'm':
              {
                scope.h = 80
              }
              break;
            case 'l':
              {
                scope.h = 120
              }
              break;
            default:
              {
                throw new Error('unknow size')
              }
          }
          jqCanvas.attr('width', scope.h)
          jqCanvas.attr('height', scope.h)

          var canvas = angular.element(tElement).find('canvas')[0]
          if (!canvas.getContext) throw new Error('canvas not supported')

          scope.ctx = canvas.getContext("2d");
          scope.draw('square')

        }
      }
    }])

    .directive('psBlock', ['psConfig', function (psConfig) {
      return {
        require: '^placeholderShimmer',
        controller: 'psCtrl',
        restrict: 'E',
        scope: {
          style: '@?'
        },
        template: '<canvas style="{{ style }}" ></canvas>',
        link: function link(scope, tElement) {

          var jqCanvas = angular.element(tElement).find('canvas')
          
          scope.width = 50
          scope.height = 50

          jqCanvas.attr('width',scope.width)
          jqCanvas.attr('height',scope.height)

          var canvas = angular.element(tElement).find('canvas')[0]
          if (!canvas.getContext) throw new Error('canvas not supported')

          scope.ctx = canvas.getContext("2d");
          scope.draw('block')
        }
      }
    }])

})();