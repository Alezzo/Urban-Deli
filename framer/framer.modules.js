require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.animationOptions = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode != null ? this.options.debugMode : DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      var i, len, ref, results, subLayer;
      ref = changeList.added;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        results.push(this.addView(subLayer, true));
      }
      return results;
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit(Events.Change);
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, preventHistory, switchInstant;
    this.transition(this._getLastHistoryItem(), direction = DIR.LEFT, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  return ViewNavigationController;

})(Layer);

},{}],"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.animationOptions = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode != null ? this.options.debugMode : DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      var i, len, ref, results, subLayer;
      ref = changeList.added;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        results.push(this.addView(subLayer, true));
      }
      return results;
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit(Events.Change);
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, preventHistory, switchInstant;
    this.transition(this._getLastHistoryItem(), direction = DIR.LEFT, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  return ViewNavigationController;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9BbGVrc2FuZGFyL0RvY3VtZW50cy9IaS1maSBwcm90b3R5cGUuZnJhbWVyL21vZHVsZXMvVmlld05hdmlnYXRpb25Db250cm9sbGVyLmpzIiwiL1VzZXJzL0FsZWtzYW5kYXIvRG9jdW1lbnRzL0hpLWZpIHByb3RvdHlwZS5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QixnQkFBQSxHQUFrQixTQUFDLElBQUQsRUFBTyxLQUFQOztNQUFPLFFBQVEsSUFBQyxDQUFBOztXQUNqQyxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7QUFDZCxZQUFBO1FBQUEsSUFBRyxJQUFJLENBQUMsVUFBTCxLQUFxQixLQUF4QjtVQUNDLFVBQUEsR0FBaUIsSUFBQSxLQUFBLENBQ2hCO1lBQUEsSUFBQSxFQUFNLG9CQUFOO1lBQ0EsS0FBQSxFQUFPLEVBRFA7WUFFQSxNQUFBLEVBQVEsRUFGUjtZQUdBLFVBQUEsRUFBWSxJQUhaO1dBRGdCO1VBTWpCLElBQUcsS0FBQyxDQUFBLFNBQUQsS0FBYyxLQUFqQjtZQUNDLFVBQVUsQ0FBQyxlQUFYLEdBQTZCLGNBRDlCOztVQUdBLFVBQVUsQ0FBQyxLQUFYLEdBQW1CO2lCQUVuQixVQUFVLENBQUMsRUFBWCxDQUFjLE1BQU0sQ0FBQyxLQUFyQixFQUE0QixTQUFBO21CQUMzQixLQUFDLENBQUEsSUFBRCxDQUFBO1VBRDJCLENBQTVCLEVBWkQ7O01BRGM7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWY7RUFEaUI7Ozs7R0F2STRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICB2YXIgQU5JTUFUSU9OX09QVElPTlMsIEJBQ0tCVVRUT05fVklFV19OQU1FLCBCQUNLX0JVVFRPTl9GUkFNRSwgREVCVUdfTU9ERSwgRElSLCBJTklUSUFMX1ZJRVdfTkFNRSwgUFVTSDtcblxuICBleHRlbmQoVmlld05hdmlnYXRpb25Db250cm9sbGVyLCBzdXBlckNsYXNzKTtcblxuICBJTklUSUFMX1ZJRVdfTkFNRSA9IFwiaW5pdGlhbFZpZXdcIjtcblxuICBCQUNLQlVUVE9OX1ZJRVdfTkFNRSA9IFwidm5jLWJhY2tCdXR0b25cIjtcblxuICBBTklNQVRJT05fT1BUSU9OUyA9IHtcbiAgICB0aW1lOiAwLjMsXG4gICAgY3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuICB9O1xuXG4gIEJBQ0tfQlVUVE9OX0ZSQU1FID0ge1xuICAgIHg6IDAsXG4gICAgeTogNDAsXG4gICAgd2lkdGg6IDg4LFxuICAgIGhlaWdodDogODhcbiAgfTtcblxuICBQVVNIID0ge1xuICAgIFVQOiBcInB1c2hVcFwiLFxuICAgIERPV046IFwicHVzaERvd25cIixcbiAgICBMRUZUOiBcInB1c2hMZWZ0XCIsXG4gICAgUklHSFQ6IFwicHVzaFJpZ2h0XCIsXG4gICAgQ0VOVEVSOiBcInB1c2hDZW50ZXJcIlxuICB9O1xuXG4gIERJUiA9IHtcbiAgICBVUDogXCJ1cFwiLFxuICAgIERPV046IFwiZG93blwiLFxuICAgIExFRlQ6IFwibGVmdFwiLFxuICAgIFJJR0hUOiBcInJpZ2h0XCJcbiAgfTtcblxuICBERUJVR19NT0RFID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gVmlld05hdmlnYXRpb25Db250cm9sbGVyKG9wdGlvbnMpIHtcbiAgICB2YXIgYmFzZSwgYmFzZTEsIGJhc2UyLCBiYXNlMztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zICE9IG51bGwgPyBvcHRpb25zIDoge307XG4gICAgdGhpcy52aWV3cyA9IHRoaXMuaGlzdG9yeSA9IHRoaXMuaW5pdGlhbFZpZXcgPSB0aGlzLmN1cnJlbnRWaWV3ID0gdGhpcy5wcmV2aW91c1ZpZXcgPSB0aGlzLmFuaW1hdGlvbk9wdGlvbnMgPSB0aGlzLmluaXRpYWxWaWV3TmFtZSA9IG51bGw7XG4gICAgaWYgKChiYXNlID0gdGhpcy5vcHRpb25zKS53aWR0aCA9PSBudWxsKSB7XG4gICAgICBiYXNlLndpZHRoID0gU2NyZWVuLndpZHRoO1xuICAgIH1cbiAgICBpZiAoKGJhc2UxID0gdGhpcy5vcHRpb25zKS5oZWlnaHQgPT0gbnVsbCkge1xuICAgICAgYmFzZTEuaGVpZ2h0ID0gU2NyZWVuLmhlaWdodDtcbiAgICB9XG4gICAgaWYgKChiYXNlMiA9IHRoaXMub3B0aW9ucykuY2xpcCA9PSBudWxsKSB7XG4gICAgICBiYXNlMi5jbGlwID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKChiYXNlMyA9IHRoaXMub3B0aW9ucykuYmFja2dyb3VuZENvbG9yID09IG51bGwpIHtcbiAgICAgIGJhc2UzLmJhY2tncm91bmRDb2xvciA9IFwiIzk5OVwiO1xuICAgIH1cbiAgICBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuX19zdXBlcl9fLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgdGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLnZpZXdzID0gW107XG4gICAgdGhpcy5oaXN0b3J5ID0gW107XG4gICAgdGhpcy5hbmltYXRpb25PcHRpb25zID0gdGhpcy5vcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgfHwgQU5JTUFUSU9OX09QVElPTlM7XG4gICAgdGhpcy5pbml0aWFsVmlld05hbWUgPSB0aGlzLm9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lIHx8IElOSVRJQUxfVklFV19OQU1FO1xuICAgIHRoaXMuYmFja0J1dHRvbkZyYW1lID0gdGhpcy5vcHRpb25zLmJhY2tCdXR0b25GcmFtZSB8fCBCQUNLX0JVVFRPTl9GUkFNRTtcbiAgICB0aGlzLmRlYnVnTW9kZSA9IHRoaXMub3B0aW9ucy5kZWJ1Z01vZGUgIT0gbnVsbCA/IHRoaXMub3B0aW9ucy5kZWJ1Z01vZGUgOiBERUJVR19NT0RFO1xuICAgIHRoaXMub24oXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIGZ1bmN0aW9uKGNoYW5nZUxpc3QpIHtcbiAgICAgIHZhciBpLCBsZW4sIHJlZiwgcmVzdWx0cywgc3ViTGF5ZXI7XG4gICAgICByZWYgPSBjaGFuZ2VMaXN0LmFkZGVkO1xuICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHN1YkxheWVyID0gcmVmW2ldO1xuICAgICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRWaWV3KHN1YkxheWVyLCB0cnVlKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9KTtcbiAgfVxuXG4gIFZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuYWRkVmlldyA9IGZ1bmN0aW9uKHZpZXcsIHZpYUludGVybmFsQ2hhbmdlRXZlbnQpIHtcbiAgICB2YXIgb2JqLCB2bmNIZWlnaHQsIHZuY1dpZHRoO1xuICAgIHZuY1dpZHRoID0gdGhpcy5vcHRpb25zLndpZHRoO1xuICAgIHZuY0hlaWdodCA9IHRoaXMub3B0aW9ucy5oZWlnaHQ7XG4gICAgdmlldy5zdGF0ZXMuYWRkKChcbiAgICAgIG9iaiA9IHt9LFxuICAgICAgb2JqW1wiXCIgKyBQVVNILlVQXSA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogLXZuY0hlaWdodFxuICAgICAgfSxcbiAgICAgIG9ialtcIlwiICsgUFVTSC5MRUZUXSA9IHtcbiAgICAgICAgeDogLXZuY1dpZHRoLFxuICAgICAgICB5OiAwXG4gICAgICB9LFxuICAgICAgb2JqW1wiXCIgKyBQVVNILkNFTlRFUl0gPSB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICBvYmpbXCJcIiArIFBVU0guUklHSFRdID0ge1xuICAgICAgICB4OiB2bmNXaWR0aCxcbiAgICAgICAgeTogMFxuICAgICAgfSxcbiAgICAgIG9ialtcIlwiICsgUFVTSC5ET1dOXSA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogdm5jSGVpZ2h0XG4gICAgICB9LFxuICAgICAgb2JqXG4gICAgKSk7XG4gICAgdmlldy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9IHRoaXMuYW5pbWF0aW9uT3B0aW9ucztcbiAgICBpZiAodmlldy5uYW1lID09PSB0aGlzLmluaXRpYWxWaWV3TmFtZSkge1xuICAgICAgdGhpcy5pbml0aWFsVmlldyA9IHZpZXc7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdmlldztcbiAgICAgIHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQoUFVTSC5DRU5URVIpO1xuICAgICAgdGhpcy5oaXN0b3J5LnB1c2godmlldyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQoUFVTSC5SSUdIVCk7XG4gICAgfVxuICAgIGlmICghKHZpZXcuc3VwZXJMYXllciA9PT0gdGhpcyB8fCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50KSkge1xuICAgICAgdmlldy5zdXBlckxheWVyID0gdGhpcztcbiAgICB9XG4gICAgaWYgKHZpZXcubmFtZSAhPT0gdGhpcy5pbml0aWFsVmlld05hbWUpIHtcbiAgICAgIHRoaXMuX2FwcGx5QmFja0J1dHRvbih2aWV3KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudmlld3MucHVzaCh2aWV3KTtcbiAgfTtcblxuICBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLnRyYW5zaXRpb24gPSBmdW5jdGlvbih2aWV3LCBkaXJlY3Rpb24sIHN3aXRjaEluc3RhbnQsIHByZXZlbnRIaXN0b3J5KSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PSBudWxsKSB7XG4gICAgICBkaXJlY3Rpb24gPSBESVIuUklHSFQ7XG4gICAgfVxuICAgIGlmIChzd2l0Y2hJbnN0YW50ID09IG51bGwpIHtcbiAgICAgIHN3aXRjaEluc3RhbnQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHByZXZlbnRIaXN0b3J5ID09IG51bGwpIHtcbiAgICAgIHByZXZlbnRIaXN0b3J5ID0gZmFsc2U7XG4gICAgfVxuICAgIGlmICh2aWV3ID09PSB0aGlzLmN1cnJlbnRWaWV3KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChkaXJlY3Rpb24gPT09IERJUi5SSUdIVCkge1xuICAgICAgdmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudChQVVNILlJJR0hUKTtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcuc3RhdGVzW1wic3dpdGNoXCJdKFBVU0guTEVGVCk7XG4gICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IERJUi5ET1dOKSB7XG4gICAgICB2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50KFBVU0guRE9XTik7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3LnN0YXRlc1tcInN3aXRjaFwiXShQVVNILlVQKTtcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gRElSLkxFRlQpIHtcbiAgICAgIHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQoUFVTSC5MRUZUKTtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcuc3RhdGVzW1wic3dpdGNoXCJdKFBVU0guUklHSFQpO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBESVIuVVApIHtcbiAgICAgIHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQoUFVTSC5VUCk7XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3LnN0YXRlc1tcInN3aXRjaFwiXShQVVNILkRPV04pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50KFBVU0guQ0VOVEVSKTtcbiAgICAgIHRoaXMuY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQoUFVTSC5MRUZUKTtcbiAgICB9XG4gICAgdmlldy5zdGF0ZXNbXCJzd2l0Y2hcIl0oUFVTSC5DRU5URVIpO1xuICAgIHRoaXMucHJldmlvdXNWaWV3ID0gdGhpcy5jdXJyZW50VmlldztcbiAgICB0aGlzLmN1cnJlbnRWaWV3ID0gdmlldztcbiAgICBpZiAocHJldmVudEhpc3RvcnkgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmhpc3RvcnkucHVzaCh0aGlzLnByZXZpb3VzVmlldyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVtaXQoRXZlbnRzLkNoYW5nZSk7XG4gIH07XG5cbiAgVmlld05hdmlnYXRpb25Db250cm9sbGVyLnByb3RvdHlwZS5yZW1vdmVCYWNrQnV0dG9uID0gZnVuY3Rpb24odmlldykge1xuICAgIHJldHVybiBVdGlscy5kZWxheSgwLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZpZXcuc3ViTGF5ZXJzQnlOYW1lKEJBQ0tCVVRUT05fVklFV19OQU1FKVswXS52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLmJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGlyZWN0aW9uLCBwcmV2ZW50SGlzdG9yeSwgc3dpdGNoSW5zdGFudDtcbiAgICB0aGlzLnRyYW5zaXRpb24odGhpcy5fZ2V0TGFzdEhpc3RvcnlJdGVtKCksIGRpcmVjdGlvbiA9IERJUi5MRUZULCBzd2l0Y2hJbnN0YW50ID0gZmFsc2UsIHByZXZlbnRIaXN0b3J5ID0gdHJ1ZSk7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5wb3AoKTtcbiAgfTtcblxuICBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLl9nZXRMYXN0SGlzdG9yeUl0ZW0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5W3RoaXMuaGlzdG9yeS5sZW5ndGggLSAxXTtcbiAgfTtcblxuICBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLl9hcHBseUJhY2tCdXR0b24gPSBmdW5jdGlvbih2aWV3LCBmcmFtZSkge1xuICAgIGlmIChmcmFtZSA9PSBudWxsKSB7XG4gICAgICBmcmFtZSA9IHRoaXMuYmFja0J1dHRvbkZyYW1lO1xuICAgIH1cbiAgICByZXR1cm4gVXRpbHMuZGVsYXkoMCwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBiYWNrQnV0dG9uO1xuICAgICAgICBpZiAodmlldy5iYWNrQnV0dG9uICE9PSBmYWxzZSkge1xuICAgICAgICAgIGJhY2tCdXR0b24gPSBuZXcgTGF5ZXIoe1xuICAgICAgICAgICAgbmFtZTogQkFDS0JVVFRPTl9WSUVXX05BTUUsXG4gICAgICAgICAgICB3aWR0aDogODAsXG4gICAgICAgICAgICBoZWlnaHQ6IDgwLFxuICAgICAgICAgICAgc3VwZXJMYXllcjogdmlld1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChfdGhpcy5kZWJ1Z01vZGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBiYWNrQnV0dG9uLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgYmFja0J1dHRvbi5mcmFtZSA9IGZyYW1lO1xuICAgICAgICAgIHJldHVybiBiYWNrQnV0dG9uLm9uKEV2ZW50cy5DbGljaywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuYmFjaygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfTtcblxuICByZXR1cm4gVmlld05hdmlnYXRpb25Db250cm9sbGVyO1xuXG59KShMYXllcik7XG4iLCJjbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cblx0IyBTZXR1cCBDbGFzcyBDb25zdGFudHNcblx0SU5JVElBTF9WSUVXX05BTUUgPSBcImluaXRpYWxWaWV3XCJcblx0QkFDS0JVVFRPTl9WSUVXX05BTUUgPSBcInZuYy1iYWNrQnV0dG9uXCJcblx0QU5JTUFUSU9OX09QVElPTlMgPVxuXHRcdHRpbWU6IDAuM1xuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0QkFDS19CVVRUT05fRlJBTUUgPVxuXHRcdHg6IDBcblx0XHR5OiA0MFxuXHRcdHdpZHRoOiA4OFxuXHRcdGhlaWdodDogODhcblx0UFVTSCA9XG5cdFx0VVA6ICAgICBcInB1c2hVcFwiXG5cdFx0RE9XTjogICBcInB1c2hEb3duXCJcblx0XHRMRUZUOiAgIFwicHVzaExlZnRcIlxuXHRcdFJJR0hUOiAgXCJwdXNoUmlnaHRcIlxuXHRcdENFTlRFUjogXCJwdXNoQ2VudGVyXCJcblx0RElSID1cblx0XHRVUDogICAgXCJ1cFwiXG5cdFx0RE9XTjogIFwiZG93blwiXG5cdFx0TEVGVDogIFwibGVmdFwiXG5cdFx0UklHSFQ6IFwicmlnaHRcIlxuXHRERUJVR19NT0RFID0gZmFsc2VcblxuXHQjIFNldHVwIEluc3RhbmNlIGFuZCBJbnN0YW5jZSBWYXJpYWJsZXNcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblxuXHRcdEB2aWV3cyA9IEBoaXN0b3J5ID0gQGluaXRpYWxWaWV3ID0gQGN1cnJlbnRWaWV3ID0gQHByZXZpb3VzVmlldyA9IEBhbmltYXRpb25PcHRpb25zID0gQGluaXRpYWxWaWV3TmFtZSA9IG51bGxcblx0XHRAb3B0aW9ucy53aWR0aCAgICAgICAgICAgPz0gU2NyZWVuLndpZHRoXG5cdFx0QG9wdGlvbnMuaGVpZ2h0ICAgICAgICAgID89IFNjcmVlbi5oZWlnaHRcblx0XHRAb3B0aW9ucy5jbGlwICAgICAgICAgICAgPz0gdHJ1ZVxuXHRcdEBvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcIiM5OTlcIlxuXG5cdFx0c3VwZXIgQG9wdGlvbnNcblxuXHRcdEB2aWV3cyAgID0gW11cblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0QGFuaW1hdGlvbk9wdGlvbnMgPSBAb3B0aW9ucy5hbmltYXRpb25PcHRpb25zIG9yIEFOSU1BVElPTl9PUFRJT05TXG5cdFx0QGluaXRpYWxWaWV3TmFtZSAgPSBAb3B0aW9ucy5pbml0aWFsVmlld05hbWUgIG9yIElOSVRJQUxfVklFV19OQU1FXG5cdFx0QGJhY2tCdXR0b25GcmFtZSAgPSBAb3B0aW9ucy5iYWNrQnV0dG9uRnJhbWUgIG9yIEJBQ0tfQlVUVE9OX0ZSQU1FXG5cblx0XHRAZGVidWdNb2RlID0gaWYgQG9wdGlvbnMuZGVidWdNb2RlPyB0aGVuIEBvcHRpb25zLmRlYnVnTW9kZSBlbHNlIERFQlVHX01PREVcblxuXHRcdEAub24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0QGFkZFZpZXcgc3ViTGF5ZXIsIHRydWUgZm9yIHN1YkxheWVyIGluIGNoYW5nZUxpc3QuYWRkZWRcblxuXHRhZGRWaWV3OiAodmlldywgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudCkgLT5cblxuXHRcdHZuY1dpZHRoICA9IEBvcHRpb25zLndpZHRoXG5cdFx0dm5jSGVpZ2h0ID0gQG9wdGlvbnMuaGVpZ2h0XG5cblx0XHR2aWV3LnN0YXRlcy5hZGQoXG5cdFx0XHRcIiN7IFBVU0guVVAgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC12bmNIZWlnaHRcblx0XHRcdFwiI3sgUFVTSC5MRUZUIH1cIjpcblx0XHRcdFx0eDogLXZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5DRU5URVIgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5SSUdIVCB9XCI6XG5cdFx0XHRcdHg6IHZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5ET1dOIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiB2bmNIZWlnaHRcblx0XHQpXG5cblxuXHRcdHZpZXcuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9uc1xuXG5cdFx0aWYgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblx0XHRcdEBpbml0aWFsVmlldyA9IHZpZXdcblx0XHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBoaXN0b3J5LnB1c2ggdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5SSUdIVFxuXG5cdFx0dW5sZXNzIHZpZXcuc3VwZXJMYXllciBpcyBAIG9yIHZpYUludGVybmFsQ2hhbmdlRXZlbnRcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblxuXHRcdEBfYXBwbHlCYWNrQnV0dG9uIHZpZXcgdW5sZXNzIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cblx0XHRAdmlld3MucHVzaCB2aWV3XG5cblx0dHJhbnNpdGlvbjogKHZpZXcsIGRpcmVjdGlvbiA9IERJUi5SSUdIVCwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IGZhbHNlKSAtPlxuXG5cdFx0cmV0dXJuIGZhbHNlIGlmIHZpZXcgaXMgQGN1cnJlbnRWaWV3XG5cblx0XHQjIFNldHVwIFZpZXdzIGZvciB0aGUgdHJhbnNpdGlvblxuXG5cdFx0aWYgZGlyZWN0aW9uIGlzIERJUi5SSUdIVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5SSUdIVFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5MRUZUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLkRPV05cblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guRE9XTlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5VUFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5MRUZUXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkxFRlRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guUklHSFRcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuVVBcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guVVBcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guRE9XTlxuXHRcdGVsc2Vcblx0XHRcdCMgSWYgdGhleSBzcGVjaWZpZWQgc29tZXRoaW5nIGRpZmZlcmVudCBqdXN0IHN3aXRjaCBpbW1lZGlhdGVseVxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkNFTlRFUlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guTEVGVFxuXG5cdFx0IyBQdXNoIHZpZXcgdG8gQ2VudGVyXG5cdFx0dmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guQ0VOVEVSXG5cdFx0IyBjdXJyZW50VmlldyBpcyBub3cgb3VyIHByZXZpb3VzVmlld1xuXHRcdEBwcmV2aW91c1ZpZXcgPSBAY3VycmVudFZpZXdcblx0XHQjIFNldCBvdXIgY3VycmVudFZpZXcgdG8gdGhlIHZpZXcgd2UncmUgYnJpbmdpbmcgaW5cblx0XHRAY3VycmVudFZpZXcgPSB2aWV3XG5cblx0XHQjIFN0b3JlIHRoZSBsYXN0IHZpZXcgaW4gaGlzdG9yeVxuXHRcdEBoaXN0b3J5LnB1c2ggQHByZXZpb3VzVmlldyBpZiBwcmV2ZW50SGlzdG9yeSBpcyBmYWxzZVxuXG5cdFx0QGVtaXQgRXZlbnRzLkNoYW5nZVxuXG5cdHJlbW92ZUJhY2tCdXR0b246ICh2aWV3KSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHR2aWV3LnN1YkxheWVyc0J5TmFtZShCQUNLQlVUVE9OX1ZJRVdfTkFNRSlbMF0udmlzaWJsZSA9IGZhbHNlXG5cblx0YmFjazogKCkgLT5cblx0XHRAdHJhbnNpdGlvbihAX2dldExhc3RIaXN0b3J5SXRlbSgpLCBkaXJlY3Rpb24gPSBESVIuTEVGVCwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IHRydWUpXG5cdFx0QGhpc3RvcnkucG9wKClcblxuXHRfZ2V0TGFzdEhpc3RvcnlJdGVtOiAoKSAtPlxuXHRcdHJldHVybiBAaGlzdG9yeVtAaGlzdG9yeS5sZW5ndGggLSAxXVxuXG5cdF9hcHBseUJhY2tCdXR0b246ICh2aWV3LCBmcmFtZSA9IEBiYWNrQnV0dG9uRnJhbWUpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdGlmIHZpZXcuYmFja0J1dHRvbiBpc250IGZhbHNlXG5cdFx0XHRcdGJhY2tCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRuYW1lOiBCQUNLQlVUVE9OX1ZJRVdfTkFNRVxuXHRcdFx0XHRcdHdpZHRoOiA4MFxuXHRcdFx0XHRcdGhlaWdodDogODBcblx0XHRcdFx0XHRzdXBlckxheWVyOiB2aWV3XG5cblx0XHRcdFx0aWYgQGRlYnVnTW9kZSBpcyBmYWxzZVxuXHRcdFx0XHRcdGJhY2tCdXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cblx0XHRcdFx0YmFja0J1dHRvbi5mcmFtZSA9IGZyYW1lXG5cblx0XHRcdFx0YmFja0J1dHRvbi5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdFx0QGJhY2soKVxuXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVVNBR0UgRVhBTVBMRSAxIC0gRGVmaW5lIEluaXRpYWxWaWV3TmFtZSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiMgaW5pdGlhbFZpZXdLZXkgPSBcInZpZXcxXCJcbiNcbiMgdm5jID0gbmV3IFZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBpbml0aWFsVmlld05hbWU6IGluaXRpYWxWaWV3S2V5XG4jIHZpZXcxID0gbmV3IExheWVyXG4jIFx0bmFtZTogaW5pdGlhbFZpZXdLZXlcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBVU0FHRSBFWEFNUExFIDIgLSBVc2UgZGVmYXVsdCBpbml0aWFsVmlld05hbWUgXCJpbml0aWFsVmlld1wiICMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jIHZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXJcblxuIyB2aWV3MSA9IG5ldyBMYXllclxuIyBcdG5hbWU6IFwiaW5pdGlhbFZpZXdcIlxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcInJlZFwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMgdmlldzIgPSBuZXcgTGF5ZXJcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMgdmlldzEub24gRXZlbnRzLkNsaWNrLCAtPiB2bmMudHJhbnNpdGlvbiB2aWV3MlxuIyB2aWV3Mi5vbiBFdmVudHMuQ2xpY2ssIC0+IHZuYy5iYWNrKClcbiJdfQ==
