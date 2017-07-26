angular.module('ngPlaceholderShimmer', [])

  .provider('psConfig', function () {
    this.color = "#E6E6E6"
    this.hgcolor = "#F2F2F2"
    this.timeout = 60
    this.$get = function () {
      return this
    }
  })

  .service('psService',['$timeout', function($timeout){
    this.process;

    this.close = function close(){
      if (!this.process) throw new Error('none process to close')
      $timeout.cancel(this.process)
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

    $scope.$on('$destroy',function(){
      psService.close()
    })

  }])

  .directive('placeholderShimmer', ['psConfig', 'psFactory', 'psService', '$interval', '$timeout', function (psConfig, psFactory, psService, $interval, $timeout) {
    return {
      controller: 'psCtrl',
      restrict: 'E',
      scope: {},
      link: function link(scope, tElement) {

        var jqCanvas = angular.element(tElement).find('canvas')

        var width = []
        for (var key in jqCanvas) {
          if (jqCanvas.hasOwnProperty(key) && angular.isDefined(key) && !isNaN(parseInt(key))) {
            var element = jqCanvas[key];
            var offsetLeft = psFactory.getOffsetLeft(jqCanvas[key])
            width.push(offsetLeft + (element.clientWidth*2))
          }
        }

        width.sort(function (a, b) {
          return b - a
        })
        
        scope.max = width[0]

        function process() {
          var increment = 30
          var count = Math.floor(scope.max / increment)
          var process = $interval(function () {
            
            scope.current = scope.current + increment

            scope.$parent.$broadcast('placeholder-shimmer-gradient-up', {
              current: scope.current,
              max: scope.max,
              order: scope.order,
              increment: increment
            })
            
          }, 10, count)

          return process
        }

        function reset(){
          scope.$parent.$broadcast('placeholder-shimmer-gradient-reset')
          scope.current = 0
          scope.order.reverse()
        }



        function run() {
          process().then(function () {
            reset()

            process().then(function(){
              reset()

              psService.process = $timeout(function () {
                run()
              }, 2000)
              
            })
          })
        }
        run()
        
        $timeout(function(){
          psService.close()
        }, psConfig.timeout*1000)
      }
    }
  }])

  .directive('psText', function (psConfig, psFactory) {
    return {
      require: '^placeholderShimmer',
      controller: 'psCtrl',
      restrict: 'E',
      scope: {
        width: '@',
        lines: '@',
        lineSize: '@?'
      },
      template: '<canvas style="vertical-align: top; margin: 5px;"></canvas>',
      link: function link(scope, tElement) {

        function draw(noGradient) {
          if (noGradient == true) {
            scope.ctx.fillStyle = psConfig.color
          } else {
            //define the colour of the gradient
            scope.ctx.fillStyle = psFactory.createGradient(scope.ctx, scope.current, scope.order)
          }
          scope.coord.forEach(function (val) {
            scope.ctx.fillRect(val.x, val.y, val.w, val.h)
          })
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

        var lineSize = scope.lineSize || 12

        var jqCanvas = angular.element(tElement).find('canvas')
        jqCanvas.attr('width', scope.width)
        jqCanvas.attr('height', (scope.lines * (lineSize * 2)))

        var canvas = angular.element(tElement).find('canvas')[0]
        if (!canvas.getContext) throw new Error('canvas not supported')

        scope.offsetLeft = psFactory.getOffsetLeft(canvas)

        scope.ctx = canvas.getContext("2d")
        scope.ctx.beginPath()

        //define the colour of the square
        //scope.ctx.shadowColor = '#E6E6E6';
        //scope.ctx.shadowBlur = 1

        // Draw each line
        scope.coord = []
        for (var x = 0; x < scope.lines; x++) {
          var z = Math.floor(Math.random() * ((scope.width * 10) / 100))
          scope.coord.push({
            x: 0,
            y: ((lineSize * 2) * x),
            w: (scope.width - z),
            h: lineSize
          })
        }

        draw(true)
      }
    }
  })

  .directive('psCircle', ['psConfig', 'psFactory', function (psConfig, psFactory) {
    return {
      require: '^placeholderShimmer',
      controller: 'psCtrl',
      restrict: 'E',
      scope: {
        size: '@'
      },
      template: '<canvas style="vertical-align: top;"></canvas>',
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
              scope.a = 25
              scope.b = 25
              scope.c = 20
              scope.w = 50
              scope.h = 50
            }
            break;
          case 'm':
            {
              scope.a = 50
              scope.b = 50
              scope.c = 40
              scope.w = 100
              scope.h = 100
            }
            break;
          case 'l':
            {
              scope.a = 75
              scope.b = 75
              scope.c = 60
              scope.w = 150
              scope.h = 150
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
        //ctx.shadowColor = psConfig.color
        //ctx.shadowBlur = 10

        scope.ctx.lineWidth = 1

        draw(true)
      }

    }
  }])

  .directive('psSquare',['psConfig', 'psFactory', function (psConfig, psFactory) {
    return {
      require: '^placeholderShimmer',
      controller: 'psCtrl',
      restrict: 'E',
      scope: {
        size: '@'
      },
      template: '<canvas style="vertical-align: top; padding: 5px;"></canvas>',
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
              scope.h = 100
            }
            break;
          case 'l':
            {
              scope.h = 150
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

        //define the colour of the square
        //ctx.shadowColor = psConfig.color;
        //ctx.shadowBlur = 10

        draw(true)
      }
    }
  }])

  .directive('psRectangle',['psConfig', 'psFactory', function (psConfig, psFactory) {
    return {
      require: '^placeholderShimmer',
      controller: 'psCtrl',
      restrict: 'E',
      scope: {
        width: '@',
        height: '@'
      },
      template: '<canvas style="vertical-align: top; padding: 5px;"></canvas>',
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
        jqCanvas.attr('width', scope.width)
        jqCanvas.attr('height', scope.height)

        var canvas = angular.element(tElement).find('canvas')[0]
        if (!canvas.getContext) throw new Error('canvas not supported')
        
        scope.offsetLeft = psFactory.getOffsetLeft(canvas)

        scope.ctx = canvas.getContext("2d");

        //define the colour of the square
        //ctx.shadowColor = psConfig.color;
        //ctx.shadowBlur = 10

        draw(true)
      }
    }
  }])