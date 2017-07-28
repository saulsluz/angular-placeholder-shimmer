angular.module('ngPlaceholderShimmer', [])

  .provider('psConfig', function () {
    this.color = "#EFEFEF"
    this.hgcolor = "#F6F6F6"
    this.timeout = 60
    this.$get = function () {
      return this
    }
  })

  .service('psService', ['$timeout', function ($timeout) {
    this.process;

    this.close = function () {
      if (this.process) $timeout.cancel(this.process)
    }
  }])

  .factory('psFactory', ['psConfig', function (psConfig) {
    return {
      createGradient: function (ctx, current, order) {
        //define the colour of the gradient
        var gradient = ctx.createLinearGradient(current, 0, current * 2, 0)
        gradient.addColorStop(order[0], psConfig.hgcolor)
        gradient.addColorStop(order[1], psConfig.color)
        return gradient
      },
      getOffsetLeft: function (element) {
        var offsetLeft = 0

        function find(el) {
          offsetLeft = offsetLeft + el.offsetLeft
          if (el.offsetParent) find(el.offsetParent)
        }
        find(element)
        return offsetLeft
      }
    }
  }])

  .controller('psCtrl', ['psConfig', 'psService', '$scope', function (psConfig, psService, $scope) {
    $scope.color = psConfig.color
    $scope.hgcolor = psConfig.hgcolor

    $scope.current = 0
    $scope.max = 0
    $scope.order = $scope._order = [0, 1]

    $scope.$on('$destroy', function () {
      psService.close()
    })
  }])

  .directive('placeholderShimmer', ['psConfig', 'psFactory', 'psService', '$interval', '$timeout', function (psConfig, psFactory, psService, $interval, $timeout) {
    return {
      controller: 'psCtrl',
      restrict: 'E',
      scope: {},
      link: function (scope, tElement) {

        var jqCanvas = angular.element(tElement).find('canvas')

        var width = []
        for (var key in jqCanvas) {
          if (jqCanvas.hasOwnProperty(key) && angular.isDefined(key) && !isNaN(parseInt(key))) {
            var element = jqCanvas[key];
            var offsetLeft = psFactory.getOffsetLeft(jqCanvas[key])
            width.push(offsetLeft + (element.clientWidth * 2))
          }
        }

        width.sort(function (a, b) {
          return b - a
        })

        scope.max = width[0]

        run()

        $timeout(function () {
          psService.close()
        }, psConfig.timeout * 1000)

        function process() {
          var increment = 30
          var count = Math.floor(scope.max / increment)
          return $interval(function () {
            scope.current = scope.current + increment
            scope.$parent.$broadcast('placeholder-shimmer-gradient-up', {
              current: scope.current,
              max: scope.max,
              order: scope.order,
              increment: increment
            })
          }, 10, count)
        }

        function reset() {
          scope.$parent.$broadcast('placeholder-shimmer-gradient-reset')
          scope.current = 0
          scope.order.reverse()
        }

        function run() {
          process().then(function () {
            reset()
            process().then(function () {
              reset()
              psService.process = $timeout(function () {
                run()
              }, 1000)
            })
          })
        }

      }
    }
  }])

  .directive('psText', ['psConfig','psFactory', function (psConfig, psFactory) {
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
        for (var x = 0; x<scope.line; x++){
          scope.lines.push(x)
        }
        
      }
    }
  }])

  .directive('psCircle', ['psConfig', 'psFactory', function (psConfig, psFactory) {
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

        function draw(noGradient) {
          if (noGradient == true) {
            scope.ctx.strokeStyle = psConfig.color
            scope.ctx.fillStyle = psConfig.color
          } else {
            //define the colour of the gradient
            scope.ctx.strokeStyle = psFactory.createGradient(scope.ctx, scope.current, scope.order)
            scope.ctx.fillStyle = psFactory.createGradient(scope.ctx, scope.current, scope.order)
          }

          // Draw a arc
          scope.ctx.arc(scope.a, scope.b, scope.c, 0, (2 * Math.PI), false)
          scope.ctx.fill()
          scope.ctx.stroke()
        }

        scope.$on('placeholder-shimmer-gradient-up', function (event, args) {
          if (args.current > scope.offsetLeft) {
            scope.current = scope.current + args.increment
            scope.order = args.order
            draw()
          }
        })

        scope.$on('placeholder-shimmer-gradient-reset', function (event) {
          scope.current = 0
        })

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

        scope.offsetLeft = psFactory.getOffsetLeft(canvas)

        scope.ctx = canvas.getContext("2d")
        scope.ctx.beginPath()

        //define the colour of the circle

        scope.ctx.lineWidth = 1

        draw(true)
      }
    }
  }])

  .directive('psSquare', ['psConfig', 'psFactory', function (psConfig, psFactory) {
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

        function draw(noGradient) {
          if (noGradient == true) {
            scope.ctx.fillStyle = psConfig.color
          } else {
            //define the colour of the gradient
            scope.ctx.fillStyle = psFactory.createGradient(scope.ctx, scope.current, scope.order)
          }

          scope.ctx.fillRect(0, 0, scope.h, scope.h);
        }

        scope.$on('placeholder-shimmer-gradient-up', function (event, args) {
          if (args.current > scope.offsetLeft) {
            scope.current = scope.current + args.increment
            scope.order = args.order
            draw()
          }
        })

        scope.$on('placeholder-shimmer-gradient-reset', function (event) {
          scope.current = 0
        })

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

        scope.offsetLeft = psFactory.getOffsetLeft(canvas)

        scope.ctx = canvas.getContext("2d");

        draw(true)
      }
    }
  }])

  .directive('psBlock', ['psConfig', 'psFactory', function (psConfig, psFactory) {
    return {
      require: '^placeholderShimmer',
      controller: 'psCtrl',
      restrict: 'E',
      scope: {
        style: '@?'
      },
      template: '<canvas height="50" width="50" style="{{ style }}" ></canvas>',
      link: function link(scope, tElement) {

        function draw(noGradient) {
          if (noGradient == true) {
            scope.ctx.fillStyle = psConfig.color
          } else {
            //define the colour of the gradient
            scope.ctx.fillStyle = psFactory.createGradient(scope.ctx, scope.current, scope.order)
          }

          scope.ctx.fillRect(0, 0, scope.width, scope.height);
        }

        scope.$on('placeholder-shimmer-gradient-up', function (event, args) {
          if (args.current > scope.offsetLeft) {
            scope.current = scope.current + args.increment
            scope.order = args.order
            draw()
          }
        })

        scope.$on('placeholder-shimmer-gradient-reset', function (event) {
          scope.current = 0
        })
        var jqCanvas = angular.element(tElement).find('canvas')
        //jqCanvas.attr('width', scope.width)
        //jqCanvas.attr('height', scope.height)
        scope.width = 50
        scope.height = 50

        var canvas = angular.element(tElement).find('canvas')[0]
        if (!canvas.getContext) throw new Error('canvas not supported')

        scope.offsetLeft = psFactory.getOffsetLeft(canvas)
        scope.ctx = canvas.getContext("2d");

        draw(true)
      }
    }
  }])