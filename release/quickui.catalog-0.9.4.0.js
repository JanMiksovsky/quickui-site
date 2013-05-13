/*
 * QuickUI Catalog
 * Version 0.9.4.0
 * Modular web control framework
 * http://quickui.org
 *
 * Copyright 2009-2013 Jan Miksovsky
 * Licensed under the MIT license.
 */

(function() {

/*
Shows a placeholder for a standard IAB ad unit.
The size can be specified with either pixel dimensions or a unit name.
See IAB "Ad Unit Guidelines" at http://www.iab.net for dimensions and names.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.AdPlaceholder = (function(_super) {

  __extends(AdPlaceholder, _super);

  function AdPlaceholder() {
    AdPlaceholder.__super__.constructor.apply(this, arguments);
  }

  AdPlaceholder.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "container",
        content: [
          {
            html: "<div>Advertisement</div>",
            ref: "label"
          }, {
            html: "<div/>",
            ref: "AdPlaceholder_content"
          }
        ]
      }
    ],
    generic: "true"
  };

  AdPlaceholder.prototype.content = Control.chain("$AdPlaceholder_content", "content");

  AdPlaceholder.prototype.dimensions = Control.property(function(dimensions) {
    var height, parts, s, width, _ref;
    s = (_ref = AdPlaceholder.standardUnits[dimensions]) != null ? _ref : dimensions;
    parts = s.toLowerCase().split("x");
    width = parseInt(parts[0]);
    height = parseInt(parts[1]);
    this.css({
      height: height,
      "min-height": height,
      "min-width": width,
      width: width
    });
    this.content(width + " x " + height);
    return this.checkForSizeChange();
  });

  AdPlaceholder.prototype.initialize = function() {
    if (!this.dimensions()) {
      return this.dimensions("300 x 250");
    }
  };

  AdPlaceholder.standardUnits = {
    "Medium Rectangle": "300 x 250",
    Rectangle: "180 x 150",
    Leaderboard: "728 x 90",
    "Wide Skyscraper": "160 x 600",
    "Half Page Ad": "300 x 600",
    "Button 2": "120 x 60",
    "Micro Bar": "88 x 31"
  };

  return AdPlaceholder;

})(Control);

/*
Render a JavaScript array as a table.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ArrayTable = (function(_super) {

  __extends(ArrayTable, _super);

  function ArrayTable() {
    ArrayTable.__super__.constructor.apply(this, arguments);
  }

  ArrayTable.prototype.content = Control.property(function(array) {
    var cells, innerArray, item, rows;
    rows = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        innerArray = array[_i];
        cells = (function() {
          var _j, _len1, _results1;
          _results1 = [];
          for (_j = 0, _len1 = innerArray.length; _j < _len1; _j++) {
            item = innerArray[_j];
            _results1.push((new Control("<div/>")).content(item));
          }
          return _results1;
        })();
        _results.push((new Control("<div/>")).content(cells));
      }
      return _results;
    })();
    return (new Control(this)).content(rows);
  });

  return ArrayTable;

})(Control);

/*
A text box that makes itself big enough to show its content.

This works by copying the text to a hidden div which will automatically grow in
size; the expanding copy will expand the container, which in turn stretch the
text box.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.AutoSizeTextBox = (function(_super) {

  __extends(AutoSizeTextBox, _super);

  function AutoSizeTextBox() {
    AutoSizeTextBox.__super__.constructor.apply(this, arguments);
  }

  AutoSizeTextBox.prototype.inherited = {
    content: [
      {
        html: "<textarea/>",
        ref: "textBox"
      }, {
        html: "<pre/>",
        ref: "textCopy"
      }
    ]
  };

  AutoSizeTextBox.prototype.autoSize = Control.iterator(function(addExtraLine) {
    var content;
    content = this.$textBox().content();
    if (addExtraLine) {
      content += "\n";
    }
    if (content.slice(-1) === "\n") {
      content += " ";
    }
    this.$textCopy().text(content);
    return this;
  });

  AutoSizeTextBox.prototype.content = Control.chain("$textBox", "content", function() {
    return this.autoSize();
  });

  AutoSizeTextBox.prototype.initialize = function() {
    var _this = this;
    this.$textBox().on({
      "change keyup": function(event) {
        return _this.autoSize();
      },
      keypress: function(event) {
        if (event.which === 13) {
          return _this.autoSize(true);
        }
      }
    });
    return this.inDocument(function() {
      return this._refresh();
    });
  };

  AutoSizeTextBox.prototype.minimumLines = Control.property.integer(function(minimumLines) {
    if (this.inDocument()) {
      return this._refresh();
    }
  }, 1);

  AutoSizeTextBox.prototype.placeholder = Control.chain("$textBox", "prop/placeholder");

  AutoSizeTextBox.prototype.spellcheck = Control.chain("$textBox", "prop/spellcheck");

  AutoSizeTextBox.prototype._refresh = Control.iterator(function() {
    var $textBox, $textCopy, borderBottomWidth, borderLeftWidth, borderRigthWidth, borderTopWidth, height, lineHeight, minimumLines, paddingBottom, paddingLeft, paddingRight, paddingTop;
    $textBox = this.$textBox();
    $textCopy = this.$textCopy();
    this.children().css({
      "font-family": this.css("font-family"),
      "font-size": this.css("font-size"),
      "font-style": this.css("font-style"),
      "font-weight": this.css("font-weight")
    });
    lineHeight = parseInt($textBox.css("line-height"));
    if (isNaN(lineHeight)) {
      lineHeight = Math.floor(parseInt($textBox.css("font-size")) * 1.25);
      $textBox.css("line-height", lineHeight + "px");
    }
    $textCopy.css("line-height", lineHeight + "px");
    borderBottomWidth = $textBox.css("border-bottom-width");
    borderLeftWidth = $textBox.css("border-left-width");
    borderRigthWidth = $textBox.css("border-right-width");
    borderTopWidth = $textBox.css("border-top-width");
    paddingBottom = $textBox.css("padding-bottom");
    paddingLeft = $textBox.css("padding-left");
    paddingRight = $textBox.css("padding-right");
    paddingTop = $textBox.css("padding-top");
    if (Control.browser.mozilla && !$textBox.is(":visible")) {
      if (paddingBottom === "0px" && paddingLeft === "0px" && paddingRight === "0px" && paddingTop === "0px") {
        paddingBottom = "2px";
        paddingLeft = "2px";
        paddingRight = "2px";
        paddingTop = "2px";
      }
    }
    $textCopy.css({
      "border-bottom-width": borderBottomWidth,
      "border-left-width": borderLeftWidth,
      "border-right-width": borderRigthWidth,
      "border-top-width": borderTopWidth,
      "padding-bottom": paddingBottom,
      "padding-left": paddingLeft,
      "padding-right": paddingRight,
      "padding-top": paddingTop
    });
    minimumLines = this.minimumLines();
    if (minimumLines) {
      height = minimumLines * lineHeight;
      if (!Control.browser.mozilla) {
        height += parseInt(borderTopWidth) + parseInt(paddingTop) + parseInt(paddingBottom) + parseInt(borderBottomWidth);
      }
      this.$textCopy().css("min-height", height + "px");
    }
    return this;
  });

  return AutoSizeTextBox;

})(Control);

/*
Button base class.

Handles mouse events, abstract styles.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.BasicButton = (function(_super) {

  __extends(BasicButton, _super);

  function BasicButton() {
    BasicButton.__super__.constructor.apply(this, arguments);
  }

  BasicButton.prototype.inherited = {
    generic: "true"
  };

  BasicButton.prototype.buttonState = function() {
    if (this.disabled()) {
      return BasicButton.state.disabled;
    } else if ((this.isMouseButtonDown() && this.isMouseOverControl()) || this.isKeyPressed()) {
      return BasicButton.state.active;
    } else if (this.isFocused()) {
      return BasicButton.state.focus;
    } else if (this.isMouseOverControl()) {
      return BasicButton.state.hover;
    } else {
      return BasicButton.state.normal;
    }
  };

  BasicButton.prototype.disabled = Control.chain("prop/disabled", function(disabled) {
    if (disabled) {
      this.removeClass("active focus hover");
    }
    this.toggleClass("disabled", disabled);
    return this._renderButton();
  });

  BasicButton.prototype.initialize = function() {
    var _this = this;
    this.on({
      blur: function(event) {
        return _this._trackBlur(event);
      },
      focus: function(event) {
        return _this._trackFocus(event);
      },
      keydown: function(event) {
        return _this._trackKeydown(event);
      },
      keyup: function(event) {
        return _this._trackKeyup(event);
      },
      mousedown: function(event) {
        return _this._trackMousedown(event);
      },
      mouseenter: function(event) {
        return _this._trackMousein(event);
      },
      mouseleave: function(event) {
        return _this._trackMouseout(event);
      },
      mouseup: function(event) {
        return _this._trackMouseup(event);
      }
    });
    return this._renderButton();
  };

  BasicButton.prototype.isFocused = Control.property.bool(null, false);

  BasicButton.prototype.isKeyPressed = Control.property.bool(null, false);

  BasicButton.prototype.isMouseButtonDown = Control.property.bool(null, false);

  BasicButton.prototype.isMouseOverControl = Control.property.bool(null, false);

  BasicButton.prototype.quiet = Control.chain("applyClass/quiet");

  BasicButton.state = {
    normal: 0,
    hover: 1,
    focus: 2,
    active: 3,
    disabled: 4
  };

  BasicButton.prototype.tag = "button";

  BasicButton.prototype._renderButtonState = function(buttonState) {};

  BasicButton.prototype._renderButton = function() {
    return this._renderButtonState(this.buttonState());
  };

  BasicButton.prototype._trackBlur = function(event) {
    return this.removeClass("focus").isKeyPressed(false).isFocused(false)._renderButton();
  };

  BasicButton.prototype._trackFocus = function(event) {
    return this.addClass("focus").isFocused(true)._renderButton();
  };

  BasicButton.prototype._trackKeydown = function(event) {
    if (event.which === 32 || event.which === 13) {
      return this.isKeyPressed(true)._renderButton();
    }
  };

  BasicButton.prototype._trackKeyup = function(event) {
    return this.isKeyPressed(false)._renderButton();
  };

  BasicButton.prototype._trackMousedown = function(event) {
    return this.addClass("active").isMouseButtonDown(true)._renderButton();
  };

  BasicButton.prototype._trackMousein = function(event) {
    return this.addClass("hover").isMouseOverControl(true)._renderButton();
  };

  BasicButton.prototype._trackMouseout = function(event) {
    return this.removeClass("focus hover active").isMouseOverControl(false)._renderButton();
  };

  BasicButton.prototype._trackMouseup = function(event) {
    return this.removeClass("active").isMouseButtonDown(false)._renderButton();
  };

  return BasicButton;

})(Control);

/*
A list of blog posts.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Blog = (function(_super) {

  __extends(Blog, _super);

  function Blog() {
    Blog.__super__.constructor.apply(this, arguments);
  }

  Blog.prototype.inherited = {
    content: [
      {
        control: "List",
        ref: "postList",
        itemClass: "BlogPost",
        mapFunction: "entry"
      }
    ]
  };

  Blog.prototype.count = Control.property.integer();

  Blog.prototype.feed = Control.property();

  Blog.prototype.initialize = function() {
    return this.reload();
  };

  Blog.prototype.itemClass = Control.chain("$postList", "itemClass");

  Blog.prototype.mapFunction = Control.chain("$postList", "mapFunction");

  Blog.prototype.reload = Control.iterator(function() {
    var url,
      _this = this;
    if (!this.feed()) {
      return;
    }
    url = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0";
    url += this._urlParam("q", this.feed());
    url += this._urlParam("num", this.count());
    url += this._urlParam("callback", "?");
    $.getJSON(url).success(function(data) {
      var entries;
      entries = data.responseData && data.responseData.feed && data.responseData.feed.entries ? data.responseData.feed.entries : null;
      return _this._entries(entries);
    });
    return this;
  });

  Blog.prototype._entries = Control.chain("$postList", "items");

  Blog.prototype._urlParam = function(key, value) {
    if (value) {
      return "&" + key + "=" + value;
    } else {
      return "";
    }
  };

  return Blog;

})(Control);

/*
A blog post.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.BlogPost = (function(_super) {

  __extends(BlogPost, _super);

  function BlogPost() {
    BlogPost.__super__.constructor.apply(this, arguments);
  }

  BlogPost.prototype.inherited = {
    content: [
      {
        html: "<a target=\"_blank\" />",
        ref: "BlogPost_postTitle"
      }, {
        html: "<div/>",
        ref: "BlogPost_content"
      }
    ],
    generic: "true"
  };

  BlogPost.prototype.content = Control.chain("$BlogPost_content", "content");

  BlogPost.prototype.entry = Control.property(function(entry) {
    this.postTitle(entry.title);
    this.link(entry.link);
    return this.content(entry.content);
  });

  BlogPost.prototype.postTitle = Control.chain("$BlogPost_postTitle", "content");

  BlogPost.prototype.link = Control.chain("$BlogPost_postTitle", "prop/href");

  return BlogPost;

})(Control);

/*
Conditionally shows contents if the given browser is in use.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.BrowserSpecific = (function(_super) {

  __extends(BrowserSpecific, _super);

  function BrowserSpecific() {
    BrowserSpecific.__super__.constructor.apply(this, arguments);
  }

  BrowserSpecific.prototype["default"] = Control.property();

  BrowserSpecific.prototype.initialize = function() {
    var content;
    content = void 0;
    if (Control.browser.mozilla) {
      content = this.mozilla();
    } else if (Control.browser.msie) {
      content = this.msie();
    } else if (Control.browser.opera) {
      content = this.opera();
    } else if (Control.browser.webkit) {
      content = this.webkit();
    }
    if (content === void 0) {
      content = this["default"]();
    }
    return this.content(content);
  };

  BrowserSpecific.prototype.mozilla = Control.property();

  BrowserSpecific.prototype.msie = Control.property();

  BrowserSpecific.prototype.opera = Control.property();

  BrowserSpecific.prototype.webkit = Control.property();

  return BrowserSpecific;

})(Control);

/*
A single day in a calendar
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CalendarDay = (function(_super) {

  __extends(CalendarDay, _super);

  function CalendarDay() {
    CalendarDay.__super__.constructor.apply(this, arguments);
  }

  CalendarDay.prototype.inherited = {
    generic: "true"
  };

  CalendarDay.addDays = function(date, days) {
    var noon, result;
    noon = new Date(date.getTime());
    noon.setHours(11);
    result = new Date(noon.getTime() + (days * this.MILLISECONDS_IN_DAY));
    result.setHours(date.getHours());
    return result;
  };

  CalendarDay.prototype.alternateMonth = Control.chain("applyClass/alternateMonth");

  CalendarDay.prototype.date = Control.property.date(function(date) {
    var dayOfMonth, dayOfWeek, daysFromToday, nextDate, today;
    today = CalendarDay.today();
    dayOfWeek = date.getDay();
    dayOfMonth = date.getDate();
    nextDate = CalendarDay.addDays(date, 1);
    daysFromToday = Math.round((date.getTime() - today.getTime()) / CalendarDay.MILLISECONDS_IN_DAY);
    this.past(date < today);
    this.future(date > today);
    this.firstDayOfMonth(dayOfMonth === 1);
    this.lastDayOfMonth(date.getMonth() !== nextDate.getMonth());
    this.firstWeek(dayOfMonth <= 7);
    this.sunday(dayOfWeek === 0);
    this.saturday(dayOfWeek === 6);
    this.weekday(dayOfWeek > 0 && dayOfWeek < 6);
    this.today(daysFromToday === 0);
    this.alternateMonth(Math.abs(date.getMonth() - today.getMonth()) % 2 === 1);
    return this.content(date.getDate());
  });

  CalendarDay.prototype.firstDayOfMonth = Control.chain("applyClass/firstDayOfMonth");

  CalendarDay.prototype.firstWeek = Control.chain("applyClass/firstWeek");

  CalendarDay.prototype.future = Control.chain("applyClass/future");

  CalendarDay.prototype.initialize = function() {
    var _this = this;
    this.click(function(event) {
      return _this.trigger("dateSelected", [_this.date()]);
    });
    if (!this.date()) {
      return this.date(this._defaultDate());
    }
  };

  CalendarDay.prototype.lastDayOfMonth = Control.chain("applyClass/lastDayOfMonth");

  CalendarDay.MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

  CalendarDay.midnightOnDate = function(date) {
    var d;
    d = new Date(date.getTime());
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  };

  CalendarDay.prototype.past = Control.chain("applyClass/past");

  CalendarDay.prototype.saturday = Control.chain("applyClass/saturday");

  CalendarDay.prototype.sunday = Control.chain("applyClass/sunday");

  CalendarDay.prototype.today = Control.chain("applyClass/today");

  CalendarDay.today = function() {
    return this.midnightOnDate(new Date());
  };

  CalendarDay.prototype.weekday = Control.chain("applyClass/weekday");

  CalendarDay.prototype._defaultDate = function() {
    return CalendarDay.today();
  };

  return CalendarDay;

})(Control);

/*
Shows a day of the month as a button.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CalendarDayButton = (function(_super) {

  __extends(CalendarDayButton, _super);

  function CalendarDayButton() {
    CalendarDayButton.__super__.constructor.apply(this, arguments);
  }

  CalendarDayButton.prototype.inherited = {
    content: [
      {
        control: "BasicButton",
        ref: "button",
        "class": "quiet"
      }
    ]
  };

  CalendarDayButton.prototype.content = Control.chain("$button", "content");

  return CalendarDayButton;

})(CalendarDay);

/*
A month in a calendar
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CalendarMonth = (function(_super) {

  __extends(CalendarMonth, _super);

  function CalendarMonth() {
    CalendarMonth.__super__.constructor.apply(this, arguments);
  }

  CalendarMonth.prototype.inherited = {
    content: [
      {
        control: "CalendarWeek"
      }, {
        control: "CalendarWeek"
      }, {
        control: "CalendarWeek"
      }, {
        control: "CalendarWeek"
      }, {
        control: "CalendarWeek"
      }, {
        control: "CalendarWeek"
      }
    ],
    generic: "true"
  };

  CalendarMonth.prototype.days = Control.chain("find/.CalendarDay", "control");

  CalendarMonth.prototype.culture = function(culture) {
    var result;
    result = CalendarMonth.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.weeks().culture(culture);
      this._refresh();
    }
    return result;
  };

  CalendarMonth.prototype.dayClass = Control.chain("weeks", "dayClass", function() {
    return this._refresh();
  });

  CalendarMonth.prototype.date = Control.property.date(function() {
    return this._refresh().trigger("dateChanged", [this.date()]);
  });

  CalendarMonth.prototype.dayControlForDate = function(date) {
    return this.weekControlForDate(date).dayControlForDate(date);
  };

  CalendarMonth.prototype.initialize = function() {
    if (this.date() == null) {
      return this.date(CalendarDay.today());
    }
  };

  CalendarMonth.prototype.weekControlForDate = function(date) {
    var firstDayOfMonth, month, offset, weekIndex, weeks, weeksWithDate;
    weeksWithDate = (function() {
      var _i, _len, _ref, _results;
      _ref = this.segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        month = _ref[_i];
        weeks = month.weeks();
        firstDayOfMonth = new Date(date.getTime());
        firstDayOfMonth.setDate(1);
        offset = weeks.daysSinceFirstDayOfWeek(firstDayOfMonth);
        weekIndex = Math.floor((date.getDate() + offset - 1) / 7);
        _results.push(weeks[weekIndex]);
      }
      return _results;
    }).call(this);
    return $().add(weeksWithDate).control();
  };

  CalendarMonth.prototype.weeks = Control.chain("children", "control");

  CalendarMonth.prototype._refresh = function() {
    var date, day, days, firstDayOfMonth, firstDayOfWeek, i, insideMonth, isWeekInMonth, lastDayOfMonth, lastDayOfWeek, month, week, _i, _j, _len, _len1, _ref, _ref1;
    firstDayOfMonth = CalendarDay.midnightOnDate(this.date());
    firstDayOfMonth.setDate(1);
    lastDayOfMonth = new Date(firstDayOfMonth.getTime());
    lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
    lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
    month = firstDayOfMonth.getMonth();
    _ref = this.weeks().segments();
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      week = _ref[i];
      week.date(CalendarDay.addDays(firstDayOfMonth, 7 * i));
      days = week.days();
      firstDayOfWeek = days.eq(0).date();
      lastDayOfWeek = days.eq(6).date();
      isWeekInMonth = firstDayOfWeek.getMonth() === month || lastDayOfWeek.getMonth() === month;
      week.toggleClass("hidden", !isWeekInMonth);
    }
    _ref1 = this.days().segments();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      day = _ref1[_j];
      date = day.date();
      insideMonth = (date != null) && date >= firstDayOfMonth && date <= lastDayOfMonth;
      day.toggleClass("insideMonth", insideMonth);
      day.toggleClass("outsideMonth", !insideMonth);
    }
    return this;
  };

  return CalendarMonth;

})(Control);

/*
Shows a month, allowing using to navigate months and select a date.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CalendarMonthNavigator = (function(_super) {

  __extends(CalendarMonthNavigator, _super);

  function CalendarMonthNavigator() {
    CalendarMonthNavigator.__super__.constructor.apply(this, arguments);
  }

  CalendarMonthNavigator.prototype.inherited = {
    content: [
      {
        control: "LateralNavigator",
        ref: "navigator",
        align: "center",
        content: {
          control: "MonthAndYear",
          ref: "monthHeading"
        }
      }, {
        control: "CalendarMonthWithHeadings",
        ref: "calendar",
        showMonthAndYear: false
      }, {
        html: "div",
        ref: "todayContainer",
        content: {
          control: "BasicButton",
          ref: "buttonToday",
          "class": "quiet",
          content: "Today"
        }
      }
    ],
    generic: true
  };

  CalendarMonthNavigator.prototype.culture = function(culture) {
    var result;
    result = CalendarMonthNavigator.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.$monthHeading().culture(culture);
      this.$calendar().culture(culture);
    }
    return result;
  };

  CalendarMonthNavigator.prototype.date = Control.property(function(date) {
    if (this.$calendar().date().getTime() !== date.getTime()) {
      this.$calendar().date(date);
    }
    this.$monthHeading().date(date);
    return this._applySelection();
  });

  CalendarMonthNavigator.prototype.dayClass = Control.property["class"](function(dayClass) {
    return this.$calendar().dayClass(dayClass);
  });

  CalendarMonthNavigator.prototype.dayNameFormat = Control.chain("$calendar", "dayNameFormat");

  CalendarMonthNavigator.prototype.initialize = function() {
    var _this = this;
    this.on({
      dateChanged: function(event, date) {
        return _this.date(date);
      },
      dateSelected: function(event, date) {
        return _this.$calendar().date(date);
      }
    });
    this.$navigator().on({
      next: function() {
        return _this.next();
      },
      previous: function() {
        return _this.previous();
      }
    });
    this.$buttonToday().click(function() {
      return _this.trigger("dateSelected", [CalendarDay.today()]);
    });
    if (!this.dayClass()) {
      this.dayClass(CalendarDayButton);
    }
    if (!this.date()) {
      return this.date(this.$calendar().date());
    }
  };

  CalendarMonthNavigator.prototype.next = function() {
    return this._adjustMonth(1);
  };

  CalendarMonthNavigator.prototype.nextButtonContent = Control.chain("$navigator", "nextButtonContent");

  CalendarMonthNavigator.prototype.nextButtonDisabled = Control.chain("$navigator", "nextButtonDisabled");

  CalendarMonthNavigator.prototype.previous = function() {
    return this._adjustMonth(-1);
  };

  CalendarMonthNavigator.prototype.previousButtonContent = Control.chain("$navigator", "previousButtonContent");

  CalendarMonthNavigator.prototype.previousButtonDisabled = Control.chain("$navigator", "previousButtonDisabled");

  CalendarMonthNavigator.prototype.showSelectedDate = Control.property.bool(function(showSelectedDate) {
    return this._applySelection();
  }, true);

  CalendarMonthNavigator.prototype.showTodayButton = Control.chain("$todayContainer", "visibility");

  CalendarMonthNavigator.prototype._adjustMonth = function(direction) {
    var adjustment, dayOfMonth, newDate;
    adjustment = (direction > 0 ? 1 : -1);
    newDate = new Date(this.date().getTime());
    dayOfMonth = newDate.getDate();
    newDate.setMonth(newDate.getMonth() + adjustment);
    if (newDate.getDate() !== dayOfMonth) {
      newDate.setDate(0);
    }
    return this.date(newDate);
  };

  CalendarMonthNavigator.prototype._applySelection = function() {
    var dayControl;
    this.$calendar().days().removeClass("selected");
    if (this.showSelectedDate()) {
      dayControl = this.$calendar().dayControlForDate(this.date());
      return dayControl.addClass("selected");
    }
  };

  CalendarMonthNavigator.prototype._requiredClasses = ["CalendarDayButton"];

  return CalendarMonthNavigator;

})(Control);

/*
Month calendar with headings for month name and year, plus days of week
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CalendarMonthWithHeadings = (function(_super) {

  __extends(CalendarMonthWithHeadings, _super);

  function CalendarMonthWithHeadings() {
    CalendarMonthWithHeadings.__super__.constructor.apply(this, arguments);
  }

  CalendarMonthWithHeadings.prototype.inherited = {
    content: [
      {
        control: "MonthAndYear",
        ref: "monthAndYear"
      }, {
        html: "<div/>",
        ref: "monthTable",
        content: [
          {
            control: "DaysOfWeek",
            ref: "daysOfWeek",
            format: "namesShort"
          }, {
            control: "CalendarMonth",
            ref: "calendar"
          }
        ]
      }
    ],
    generic: "true"
  };

  CalendarMonthWithHeadings.prototype.culture = Control.iterator(function(culture) {
    var date, result;
    result = this.constructor.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.$monthAndYear().culture(culture);
      this.$daysOfWeek().culture(culture);
      this.$calendar().culture(culture);
      date = this.date();
      if (date) {
        this.date(date);
      }
    }
    return result;
  });

  CalendarMonthWithHeadings.prototype.date = Control.chain("$calendar", "date", function(date) {
    return this.$monthAndYear().date(date);
  });

  CalendarMonthWithHeadings.prototype.dayClass = Control.chain("$calendar", "dayClass");

  CalendarMonthWithHeadings.prototype.days = Control.chain("$calendar", "days");

  CalendarMonthWithHeadings.prototype.dayControlForDate = function(date) {
    return this.$calendar().dayControlForDate(date);
  };

  CalendarMonthWithHeadings.prototype.dayNameFormat = Control.chain("$daysOfWeek", "format");

  CalendarMonthWithHeadings.prototype.initialize = function() {
    if (this.date() != null) {
      return this.$monthAndYear().date(this.date());
    } else {
      return this.date(CalendarDay.today());
    }
  };

  CalendarMonthWithHeadings.prototype.showMonthAndYear = Control.chain("$monthAndYear", "visibility");

  return CalendarMonthWithHeadings;

})(Control);

/*
Shows a single calendar week
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CalendarWeek = (function(_super) {

  __extends(CalendarWeek, _super);

  function CalendarWeek() {
    CalendarWeek.__super__.constructor.apply(this, arguments);
  }

  CalendarWeek.prototype.inherited = {
    content: [
      {
        control: "CalendarDay",
        "class": "firstDayOfWeek"
      }, {
        control: "CalendarDay"
      }, {
        control: "CalendarDay"
      }, {
        control: "CalendarDay"
      }, {
        control: "CalendarDay"
      }, {
        control: "CalendarDay"
      }, {
        control: "CalendarDay",
        "class": "lastDayOfWeek"
      }
    ]
  };

  CalendarWeek.prototype.culture = function(culture) {
    var result;
    result = CalendarWeek.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this._refresh();
    }
    return result;
  };

  CalendarWeek.prototype.date = Control.property.date(function() {
    return this._refresh();
  });

  CalendarWeek.prototype.dayControlForDate = function(date) {
    var dayIndex, days, week;
    days = (function() {
      var _i, _len, _ref, _results;
      _ref = this.segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        week = _ref[_i];
        dayIndex = week.daysSinceFirstDayOfWeek(date);
        _results.push(week.days()[dayIndex]);
      }
      return _results;
    }).call(this);
    return $().add(days).control();
  };

  CalendarWeek.prototype.dayClass = Control.iterator(function(dayClass) {
    var days;
    if (dayClass === void 0) {
      return this.days().constructor;
    } else {
      this.days().transmute(dayClass);
      days = this.days();
      days.eq(0).addClass("firstDayOfWeek");
      days.eq(6).addClass("lastDayOfWeek");
      this._refresh();
      return this;
    }
  });

  CalendarWeek.prototype.days = Control.chain("children", "control");

  CalendarWeek.prototype.initialize = function() {
    if (!this.date()) {
      return this.date(CalendarDay.today());
    }
  };

  CalendarWeek.prototype.daysSinceFirstDayOfWeek = function(date) {
    var firstDayOfWeek;
    firstDayOfWeek = this.firstDayOfWeek();
    return (date.getDay() - firstDayOfWeek + 7) % 7;
  };

  CalendarWeek.prototype.firstDayOfWeek = function() {
    var _ref, _ref1;
    return (_ref = (_ref1 = this.culture()) != null ? _ref1.calendar.firstDay : void 0) != null ? _ref : 0;
  };

  CalendarWeek.prototype._refresh = function() {
    var date, dateStart, day, i, _i, _len, _ref, _results;
    date = CalendarDay.midnightOnDate(this.date());
    dateStart = CalendarDay.addDays(date, -this.daysSinceFirstDayOfWeek(date));
    _ref = this.days().segments();
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      day = _ref[i];
      _results.push(day.date(CalendarDay.addDays(dateStart, i)));
    }
    return _results;
  };

  return CalendarWeek;

})(Control);

/*
A panel that can expand and collapse.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Collapsible = (function(_super) {

  __extends(Collapsible, _super);

  function Collapsible() {
    Collapsible.__super__.constructor.apply(this, arguments);
  }

  Collapsible.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "Collapsible_heading"
      }, {
        html: "<div/>",
        ref: "Collapsible_content"
      }
    ],
    generic: "true"
  };

  Collapsible.prototype.content = Control.chain("$Collapsible_content", "content");

  Collapsible.prototype.duration = Control.property(null, "fast");

  Collapsible.prototype.collapsed = Control.iterator(function(value) {
    var result,
      _this = this;
    if (value === void 0) {
      return this._collapsed();
    } else {
      if (this.inDocument()) {
        result = value ? "hide" : "show";
        this.$Collapsible_content().animate({
          height: result,
          opacity: result
        }, this.duration(), null, function() {
          return _this.toggleClass("collapsed", value);
        });
      } else {
        this.toggleClass("collapsed", value);
        this.$Collapsible_content().toggle(!value);
      }
      if (this._collapsed() !== value) {
        this.trigger("collapsedChanged");
        this._collapsed(value);
      }
      return this;
    }
  });

  Collapsible.prototype.heading = Control.chain("$Collapsible_heading", "content");

  Collapsible.prototype.initialize = function() {
    var _this = this;
    return this.$Collapsible_heading().click(function() {
      if (_this.toggleOnClick()) {
        return _this.toggleCollapse();
      }
    });
  };

  Collapsible.prototype.toggleCollapse = function() {
    return this.collapsed(!this.collapsed());
  };

  Collapsible.prototype.toggleOnClick = Control.property.bool(null, true);

  Collapsible.prototype._collapsed = Control.property.bool(null, false);

  return Collapsible;

})(Control);

/*
A collapsible panel whose heading region, by default, includes a button on
the far right that indicates the panel's collapsed/expanded state.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CollapsibleWithHeadingButton = (function(_super) {

  __extends(CollapsibleWithHeadingButton, _super);

  function CollapsibleWithHeadingButton() {
    CollapsibleWithHeadingButton.__super__.constructor.apply(this, arguments);
  }

  CollapsibleWithHeadingButton.prototype.inherited = {
    heading: [
      {
        control: "BasicButton",
        ref: "headingButton",
        content: [
          {
            html: "<div>+</div>",
            ref: "collapsedButtonContent"
          }, {
            html: "<div>−</div>",
            ref: "expandedButtonContent"
          }
        ]
      }, {
        control: "Fader",
        ref: "CollapsibleWithHeadingButton_heading"
      }
    ]
  };

  CollapsibleWithHeadingButton.prototype.buttonClass = Control.chain("$headingButton", "transmute");

  CollapsibleWithHeadingButton.prototype.collapsedButtonContent = Control.chain("$collapsedButtonContent", "content");

  CollapsibleWithHeadingButton.prototype.expandedButtonContent = Control.chain("$expandedButtonContent", "content");

  CollapsibleWithHeadingButton.prototype.heading = Control.chain("$CollapsibleWithHeadingButton_heading", "content");

  CollapsibleWithHeadingButton.prototype.initialize = function() {
    var $button,
      _this = this;
    $button = this.$headingButton();
    return this.$Collapsible_heading().on({
      mouseenter: function() {
        return $button.addClass("hover");
      },
      mouseleave: function() {
        return $button.removeClass("hover");
      }
    });
  };

  return CollapsibleWithHeadingButton;

})(Collapsible);

/*
Shows a block of a CSS color, either a color name or value.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ColorSwatch = (function(_super) {

  __extends(ColorSwatch, _super);

  function ColorSwatch() {
    ColorSwatch.__super__.constructor.apply(this, arguments);
  }

  ColorSwatch.prototype.color = function(color) {
    var colorValid, colorValue;
    if (color === void 0) {
      return this.css("background-color");
    } else {
      this.css("background-color", "white");
      this.css("background-color", color);
      colorValid = void 0;
      if (color === "" || color === null) {
        colorValid = false;
      } else if (color === "white" || color === "rgb( 255, 255, 255 )") {
        colorValid = true;
      } else {
        colorValue = this.css("background-color");
        colorValid = !(colorValue === "white" || colorValue === "rgb( 255, 255, 255 )");
      }
      return this.toggleClass("none", !colorValid);
    }
  };

  return ColorSwatch;

})(Control);

/*
A text box that shows a color swatch of the currently-entered color.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ColorSwatchTextBox = (function(_super) {

  __extends(ColorSwatchTextBox, _super);

  function ColorSwatchTextBox() {
    ColorSwatchTextBox.__super__.constructor.apply(this, arguments);
  }

  ColorSwatchTextBox.prototype.inherited = {
    content: [
      {
        control: "ColorSwatch",
        ref: "swatch"
      }, {
        html: "<input type=\"text\" />",
        ref: "ColorSwatchTextBox_content"
      }
    ]
  };

  ColorSwatchTextBox.prototype.content = Control.chain("$ColorSwatchTextBox_content", "content", function(content) {
    return this._refresh();
  });

  ColorSwatchTextBox.prototype.initialize = function() {
    var _this = this;
    return this.keyup(function() {
      return _this._refresh();
    });
  };

  ColorSwatchTextBox.prototype._refresh = function() {
    return this.$swatch().color(this.content());
  };

  return ColorSwatchTextBox;

})(Control);

/*
Heading for a 7 day week calendar, globalized.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.DaysOfWeek = (function(_super) {

  __extends(DaysOfWeek, _super);

  function DaysOfWeek() {
    DaysOfWeek.__super__.constructor.apply(this, arguments);
  }

  DaysOfWeek.prototype.inherited = {
    content: ["<div class=\"dayOfWeek\" />", "<div class=\"dayOfWeek\" />", "<div class=\"dayOfWeek\" />", "<div class=\"dayOfWeek\" />", "<div class=\"dayOfWeek\" />", "<div class=\"dayOfWeek\" />", "<div class=\"dayOfWeek\" />"],
    generic: "true"
  };

  DaysOfWeek.prototype.culture = function(culture) {
    var result;
    result = DaysOfWeek.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.format(this.format());
    }
    return result;
  };

  DaysOfWeek.days = {
    names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  };

  DaysOfWeek.prototype.format = Control.property(function(format) {
    var $children, culture, day, dayName, dayNameEnum, dayNames, firstDay, i, _i, _ref, _results;
    culture = this.culture();
    dayNameEnum = culture ? culture.calendar.days : DaysOfWeek.days;
    dayNames = dayNameEnum[format];
    firstDay = culture ? culture.calendar.firstDay : 0;
    $children = this.children();
    _results = [];
    for (i = _i = 0, _ref = dayNames.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      day = (i + firstDay) % 7;
      dayName = dayNames[day];
      _results.push($children.eq(i).content(dayName));
    }
    return _results;
  });

  DaysOfWeek.prototype.initialize = function() {
    if (!this.format()) {
      return this.format("namesAbbr");
    }
  };

  return DaysOfWeek;

})(Control);

/*
Load different content, control class, or styles depending on the type of device.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.DeviceSpecific = (function(_super) {

  __extends(DeviceSpecific, _super);

  function DeviceSpecific() {
    DeviceSpecific.__super__.constructor.apply(this, arguments);
  }

  DeviceSpecific.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "placeholder"
      }
    ]
  };

  DeviceSpecific.prototype.content = Control.chain("$placeholder", "content");

  DeviceSpecific.prototype["default"] = Control.property();

  DeviceSpecific.prototype.defaultClass = Control.property["class"]();

  DeviceSpecific.prototype.initialize = function() {
    var $placeholder, deviceClass, deviceClasses, deviceContent;
    deviceClass = void 0;
    deviceClasses = void 0;
    deviceContent = void 0;
    if (DeviceSpecific.isMobile()) {
      deviceClass = this.mobileClass();
      deviceClasses = "mobile";
      deviceContent = this.mobile();
    }
    if (deviceClass === void 0) {
      deviceClass = this.defaultClass();
    }
    if (deviceContent === void 0) {
      deviceContent = this["default"]();
    }
    $placeholder = this.$placeholder();
    if (deviceClass) {
      $placeholder = $placeholder.transmute(deviceClass, false, true);
      this.referencedElement("placeholder", $placeholder);
    }
    if (deviceContent) {
      $placeholder.content(deviceContent);
    }
    if (deviceClasses) {
      return $placeholder.addClass(deviceClasses);
    }
  };

  DeviceSpecific.isMobile = function() {
    var userAgent;
    userAgent = navigator.userAgent;
    return userAgent.indexOf("Mobile") >= 0 && userAgent.indexOf("iPad") < 0;
  };

  DeviceSpecific.prototype.mobile = Control.property();

  DeviceSpecific.prototype.mobileClass = Control.property["class"]();

  return DeviceSpecific;

})(Control);

/*
Renders a JavaScript dictionary as a table.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.DictionaryTable = (function(_super) {

  __extends(DictionaryTable, _super);

  function DictionaryTable() {
    DictionaryTable.__super__.constructor.apply(this, arguments);
  }

  DictionaryTable.prototype.content = Control.property(function(dictionary) {
    var array, key, value;
    array = (function() {
      var _results;
      _results = [];
      for (key in dictionary) {
        value = dictionary[key];
        _results.push([key, value]);
      }
      return _results;
    })();
    return (new ArrayTable(this)).content(array);
  });

  return DictionaryTable;

})(ArrayTable);

/*
Fades its content to the background color on the right/bottom edge if the
content is too long. Must set explicitly set the control's background-color
if the color is not white.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Fader = (function(_super) {

  __extends(Fader, _super);

  function Fader() {
    Fader.__super__.constructor.apply(this, arguments);
  }

  Fader.prototype.inherited = {
    "class": "horizontal",
    content: [
      {
        html: "<div/>",
        ref: "Fader_content"
      }, {
        control: "Gradient",
        ref: "gradient",
        direction: "horizontal"
      }
    ]
  };

  Fader.prototype.content = Control.chain("$Fader_content", "content");

  Fader.prototype.direction = Control.property(function(direction) {
    var vertical;
    vertical = direction !== "horizontal";
    this.toggleClass("horizontal", !vertical);
    this.toggleClass("vertical", vertical);
    if (this.inDocument()) {
      this._redraw();
    }
    return this.$gradient().direction(direction);
  });

  Fader.prototype.initialize = function() {
    return this.inDocument(function() {
      return this._redraw();
    });
  };

  Fader.prototype._expandShortHexValue = function(s) {
    var c, i, longHex, shortHex, _i, _ref;
    shortHex = s.slice(1);
    longHex = "";
    for (i = _i = 0, _ref = shortHex.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      c = shortHex[i];
      longHex += c + c;
    }
    return "#" + longHex;
  };

  Fader.prototype._hexByte = function(n) {
    var s;
    s = (new Number(n & 0xFF)).toString(16);
    if (s.length === 1) {
      s = "0" + s;
    }
    return s;
  };

  Fader.prototype._redraw = Control.iterator(function() {
    var backgroundColor, backgroundHex;
    backgroundColor = this.css("background-color");
    backgroundHex = backgroundColor.length === 4 ? this._expandShortHexValue(backgroundColor) : backgroundColor.substr(0, 3).toLowerCase() === "rgb" ? this._rgbStringToHexColor(backgroundColor) : backgroundColor;
    this.$gradient().start(backgroundHex + "00").end(backgroundHex);
    return this;
  });

  Fader.prototype._rgbStringToHexColor = function(rgbString) {
    var rgb;
    rgb = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + this._hexByte(rgb[1]) + this._hexByte(rgb[2]) + this._hexByte(rgb[3]);
  };

  return Fader;

})(Control);

/*
Shows the most interesting photo on Flickr for a given day.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.FlickrInterestingDay = (function(_super) {

  __extends(FlickrInterestingDay, _super);

  function FlickrInterestingDay() {
    FlickrInterestingDay.__super__.constructor.apply(this, arguments);
  }

  FlickrInterestingDay.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "FlickrInterestingDay_content"
      }, {
        html: "<a/>",
        ref: "link",
        content: [
          {
            html: "<img/>",
            ref: "image"
          }
        ]
      }
    ],
    generic: "false"
  };

  FlickrInterestingDay.prototype.autoLoad = Control.property.bool(function(autoLoad) {
    if (autoLoad && (this.image() == null)) {
      return this.loadPhoto();
    }
  });

  FlickrInterestingDay.prototype.date = function(date) {
    var result;
    result = FlickrInterestingDay.__super__.date.call(this, date);
    if (date !== void 0) {
      this.image(null).href(null);
      if (this.autoLoad()) {
        this.loadPhoto();
      }
    }
    return result;
  };

  FlickrInterestingDay.prototype.content = Control.chain("$FlickrInterestingDay_content", "content");

  FlickrInterestingDay.getInterestingPhotoForDate = function(date, callback) {
    var cachedPhoto, flickrDate, params,
      _this = this;
    flickrDate = this._formatFlickrDate(date);
    cachedPhoto = this._cache[flickrDate];
    if (cachedPhoto) {
      callback(cachedPhoto);
      return;
    }
    params = {
      method: "flickr.interestingness.getList",
      date: flickrDate,
      per_page: 1
    };
    return this.getFlickrPhotos(params, function(flickrPhotos) {
      var first, photo;
      if (flickrPhotos && flickrPhotos.length > 0) {
        first = flickrPhotos[0];
        photo = {
          src: _this.getFlickrImageSrc(first, "s"),
          href: _this.getFlickrImageHref(first)
        };
        _this._cache[flickrDate] = photo;
        return callback(photo);
      }
    });
  };

  FlickrInterestingDay.getFlickrPhotos = function(params, callback) {
    var baseUrl, url,
      _this = this;
    baseUrl = "http://api.flickr.com/services/rest/";
    url = baseUrl + "?api_key=" + this._flickrApiKey + this._formatUrlParams(params) + "&format=json" + "&jsoncallback=?";
    return $.getJSON(url).success(function(data) {
      if (data && data.photos) {
        return callback(data.photos.photo);
      }
    });
  };

  FlickrInterestingDay.getFlickrImageSrc = function(flickrPhoto, size) {
    var sizeParam;
    sizeParam = size ? "_" + size : "";
    return "http://farm" + flickrPhoto.farm + ".static.flickr.com/" + flickrPhoto.server + "/" + flickrPhoto.id + "_" + flickrPhoto.secret + sizeParam + ".jpg";
  };

  FlickrInterestingDay.getFlickrImageHref = function(flickrPhoto) {
    return "http://flickr.com/photo.gne?id=" + flickrPhoto.id;
  };

  FlickrInterestingDay.prototype.href = Control.chain("$link", "attr/href");

  FlickrInterestingDay.prototype.image = Control.chain("$image", "attr/src");

  FlickrInterestingDay.prototype.loadPhoto = Control.iterator(function() {
    var baseUrl, date, url,
      _this = this;
    date = this.date();
    if (date && date < CalendarDay.today()) {
      FlickrInterestingDay.getInterestingPhotoForDate(date, function(photo) {
        if (photo && date === _this.date()) {
          return _this.image(photo.src);
        }
      });
      baseUrl = "http://www.flickr.com/explore/interesting/";
      url = baseUrl + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      this.href(url);
    }
    return this;
  });

  FlickrInterestingDay._cache = {};

  FlickrInterestingDay.prototype._defaultDate = function() {
    var date;
    date = CalendarDay.today();
    date.setDate(date.getDate() - 1);
    return date;
  };

  FlickrInterestingDay._flickrApiKey = "c3685bc8d8cefcc1d25949e4c528cbb0";

  FlickrInterestingDay._formatFlickrDate = function(date) {
    var day, month, year;
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    return year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
  };

  FlickrInterestingDay._formatUrlParams = function(params) {
    var formattedParams, key, value;
    formattedParams = (function() {
      var _results;
      _results = [];
      for (key in params) {
        value = params[key];
        _results.push("&" + key + "=" + value);
      }
      return _results;
    })();
    return formattedParams.join("");
  };

  return FlickrInterestingDay;

})(CalendarDay);

/*
Shows the most interesting photo for each day of a month

Note: This makes a *separate call* to Flickr's REST API for each day of the
month, which is terrible. Unfortunately, Flickr's API doesn't allow allow a way
to get the most interesting photo for each day of the month; separate calls have
to be made per day.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.FlickrInterestingNavigator = (function(_super) {

  __extends(FlickrInterestingNavigator, _super);

  function FlickrInterestingNavigator() {
    FlickrInterestingNavigator.__super__.constructor.apply(this, arguments);
  }

  FlickrInterestingNavigator.prototype.className = "FlickrInterestingNavigator";

  FlickrInterestingNavigator.prototype.inherited = {
    dayClass: "FlickrInterestingDay",
    dayNameFormat: "namesAbbr",
    generic: "false",
    previousButtonContent: [
      {
        html: "span",
        "class": "chevron",
        content: "«"
      }, " ", {
        control: "MonthAndYear",
        ref: "previousMonthName",
        "class": "monthButtonName"
      }
    ],
    nextButtonContent: [
      {
        control: "MonthAndYear",
        ref: "nextMonthName",
        "class": "monthButtonName"
      }, " ", {
        html: "span",
        "class": "chevron",
        content: "»"
      }
    ],
    showTodayButton: "false"
  };

  FlickrInterestingNavigator.prototype.culture = function(culture) {
    var result;
    result = FlickrInterestingNavigator.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.$previousMonthName().culture(culture);
      this.$nextMonthName().culture(culture);
    }
    return result;
  };

  FlickrInterestingNavigator.prototype.date = function(date) {
    var nextMonth, previousMonth, result, today;
    result = FlickrInterestingNavigator.__super__.date.call(this, date);
    if (date !== void 0) {
      previousMonth = new Date(date.getTime());
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      this.$previousMonthName().date(previousMonth).checkForSizeChange();
      nextMonth = new Date(date.getTime());
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.$nextMonthName().date(nextMonth).checkForSizeChange();
      today = new Date();
      nextMonth.setDate(1);
      this.nextButtonDisabled(nextMonth > today);
      this.$calendar().days().loadPhoto();
    }
    return result;
  };

  return FlickrInterestingNavigator;

})(CalendarMonthNavigator);

/*
Shows a random photo from Flickr's Interestingness collection for a recent day.
By default, this can be used 100 times before it starts repeating photos.

This gets photos from the day before yesterday in the current time zone.
This is done because yesterday in the current time zone may still be "today" in
Flickr's time zone, and Flickr doesn't make photos available for the current day.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.FlickrInterestingPhoto = (function(_super) {

  __extends(FlickrInterestingPhoto, _super);

  function FlickrInterestingPhoto() {
    FlickrInterestingPhoto.__super__.constructor.apply(this, arguments);
  }

  FlickrInterestingPhoto.apiKey = "c3685bc8d8cefcc1d25949e4c528cbb0";

  FlickrInterestingPhoto.prototype.tag = "img";

  FlickrInterestingPhoto.prototype.initialize = function() {
    var photo;
    this.on("load", function() {
      var control;
      control = new Control(this);
      if (Control.browser.msie && parseInt(control.width()) === 28) {
        control.css("width", "auto");
      }
      return control.checkForSizeChange();
    });
    photo = this.photo();
    if ((photo == null) || photo.length === 0) {
      return this.reload();
    }
  };

  FlickrInterestingPhoto.getRandomPhoto = function(callback, size) {
    var _this = this;
    return this.getFlickrInterestingPhotos().done(function(flickrPhotos) {
      var flickrPhoto, photo;
      _this._counter = _this._counter >= 0 ? (_this._counter + 1) % flickrPhotos.length : 0;
      flickrPhoto = flickrPhotos[_this._counter];
      photo = _this.getFlickrImageSrc(flickrPhoto, size);
      return callback(photo);
    });
  };

  FlickrInterestingPhoto.getFlickrInterestingPhotos = function() {
    var day, deferred, flickrDate, params,
      _this = this;
    if (!this._promise) {
      deferred = new jQuery.Deferred();
      this._promise = deferred.promise();
      day = new Date();
      day.setDate(day.getDate() - 2);
      flickrDate = this._formatFlickrDate(day);
      params = {
        method: "flickr.interestingness.getList",
        date: flickrDate,
        per_page: 100
      };
      this.getFlickrPhotos(params, function(flickrPhotos) {
        _this._shuffle(flickrPhotos);
        _this._flickrPhotos = flickrPhotos;
        return deferred.resolve(flickrPhotos);
      });
    }
    return this._promise;
  };

  FlickrInterestingPhoto.getFlickrPhotos = function(params, callback) {
    var baseUrl, url;
    baseUrl = "http://api.flickr.com/services/rest/";
    url = baseUrl + "?api_key=" + this.apiKey + this._formatUrlParams(params) + "&format=json" + "&jsoncallback=?";
    return $.getJSON(url, function(data) {
      if (data && data.photos) {
        return callback(data.photos.photo);
      }
    });
  };

  FlickrInterestingPhoto.getFlickrImageSrc = function(flickrPhoto, size) {
    var sizeParam;
    sizeParam = size ? "_" + size : "";
    return "http://farm" + flickrPhoto.farm + ".static.flickr.com/" + flickrPhoto.server + "/" + flickrPhoto.id + "_" + flickrPhoto.secret + sizeParam + ".jpg";
  };

  FlickrInterestingPhoto.getFlickrImageHref = function(flickrPhoto) {
    return "http://flickr.com/photo.gne?id=" + flickrPhoto.id;
  };

  FlickrInterestingPhoto.prototype.reload = Control.iterator(function() {
    var _this = this;
    FlickrInterestingPhoto.getRandomPhoto(function(photo) {
      return _this.prop("src", photo);
    }, this.photoSize());
    return this;
  });

  FlickrInterestingPhoto.prototype.photo = Control.chain("prop/src");

  FlickrInterestingPhoto.prototype.photoSize = Control.property(function() {
    var _ref;
    if (((_ref = this.photo()) != null ? _ref.length : void 0) > 0) {
      return this.reload();
    }
  });

  FlickrInterestingPhoto._formatFlickrDate = function(date) {
    var day, month, year;
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    return year + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
  };

  FlickrInterestingPhoto._formatUrlParams = function(params) {
    var formattedParams, key, value;
    formattedParams = (function() {
      var _results;
      _results = [];
      for (key in params) {
        value = params[key];
        _results.push("&" + key + "=" + value);
      }
      return _results;
    })();
    return formattedParams.join("");
  };

  FlickrInterestingPhoto._shuffle = function(array) {
    var i, j, temp, _i, _ref, _results;
    _results = [];
    for (i = _i = _ref = array.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      _results.push(array[j] = temp);
    }
    return _results;
  };

  return FlickrInterestingPhoto;

})(Control);

/*
Gradient. Supports the different browser-specific syntax.
Alpha values are possible, but all colors must be specified as RGBA hex values.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Gradient = (function(_super) {

  __extends(Gradient, _super);

  function Gradient() {
    Gradient.__super__.constructor.apply(this, arguments);
  }

  Gradient.prototype.direction = Control.property(function() {
    return this._redraw();
  }, "vertical");

  Gradient.prototype.end = Control.property(function() {
    return this._redraw();
  });

  Gradient.prototype.initialize = function() {
    return this.inDocument(function() {
      return this._redraw();
    });
  };

  Gradient.prototype.start = Control.property(function() {
    return this._redraw();
  });

  Gradient.prototype._redraw = function() {
    var direction, end, endColorString, gradientType, horizontal, position, position2, property, start, startColorString, value;
    if (!this.inDocument()) {
      return;
    }
    direction = this.direction();
    start = this.start();
    end = this.end();
    if (direction && start && end) {
      horizontal = direction === "horizontal";
      startColorString = this._hexColorToRgbString(start);
      endColorString = this._hexColorToRgbString(end);
      property = void 0;
      value = Control.browser.mozilla ? (property = "background-image", position = horizontal ? "left" : "top", "-moz-linear-gradient( " + position + ", " + startColorString + ", " + endColorString + " )") : Control.browser.webkit ? (property = "background-image", position2 = horizontal ? "right top" : "left bottom", "-webkit-gradient( linear, left top, " + position2 + ", from( " + startColorString + " ), to( " + endColorString + " ) )") : Control.browser.msie ? (property = "filter", gradientType = horizontal ? 1 : 0, "progid:DXImageTransform.Microsoft.gradient( gradientType=" + gradientType + ", startColorStr=" + startColorString + ", endColorStr=" + endColorString + " )") : void 0;
      return this.css(property, value);
    }
  };

  Gradient.prototype._hexColorToRgbString = function(hex) {
    var a, alphaString, b, color, colorStringType, g, hasAlpha, r, rgbString;
    if (hex.substr(0, 1) === "#") {
      hex = hex.substring(1);
    }
    hasAlpha = hex.length === 8;
    color = parseInt(hex, 16);
    if (Control.browser.msie) {
      rgbString = hex;
      if (hasAlpha) {
        a = rgbString.slice(6);
        rgbString = a + rgbString.substr(0, 6);
      }
      return "#" + rgbString;
    } else {
      colorStringType = hasAlpha ? "rgba" : "rgb";
      alphaString = "";
      if (hasAlpha) {
        a = (color & 0xFF) / 255;
        alphaString = "," + a;
        color = color >> 8;
      }
      r = (color >> 16) & 0xFF;
      g = (color >> 8) & 0xFF;
      b = color & 0xFF;
      return "" + colorStringType + "(" + r + "," + g + "," + b + alphaString + ")";
    }
  };

  return Gradient;

})(Control);

/*
Apply effects on hover, which can include changing the item's size
and position.

To animate color properties, use a plugin such as Color Animation at
http://plugins.jquery.com/project/color-animation.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.HighlightEffects = (function(_super) {

  __extends(HighlightEffects, _super);

  function HighlightEffects() {
    HighlightEffects.__super__.constructor.apply(this, arguments);
  }

  HighlightEffects.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "HighlightEffects_content"
      }
    ],
    generic: "true"
  };

  HighlightEffects.prototype._originalState = Control.property();

  HighlightEffects.prototype.content = Control.chain("$HighlightEffects_content", "content", function() {
    if (this.inDocument()) {
      return this._recalc();
    }
  });

  HighlightEffects.prototype.contentCss = Control.chain("$HighlightEffects_content", "css");

  HighlightEffects.prototype.duration = Control.property(null, 100);

  HighlightEffects.prototype.effects = Control.property(function() {
    return this._originalState(this._getCurrentState());
  });

  HighlightEffects.prototype.initialize = function() {
    var _this = this;
    this.on({
      layout: function() {
        return _this._recalc();
      },
      mouseenter: function() {
        return _this._hoverIn();
      },
      mouseleave: function() {
        return _this._hoverOut();
      }
    });
    return this.inDocument(function() {
      this._originalState(this._getCurrentState());
      return this._recalc();
    });
  };

  HighlightEffects.prototype._getCurrentState = function() {
    var $content, currentState, key;
    currentState = {};
    $content = this.$HighlightEffects_content();
    for (key in this.effects()) {
      currentState[key] = (function() {
        switch (key) {
          case "border-color":
            return $content.css("border-top-color");
          case "border-width":
            return $content.css("border-top-width");
          case "bottom":
          case "left":
          case "right":
          case "top":
            if ($content.css(key) === "auto") {
              return "0";
            } else {
              return $content.css(key);
            }
            break;
          default:
            return $content.css(key);
        }
      })();
    }
    return currentState;
  };

  HighlightEffects.prototype._hoverIn = function() {
    return this.$HighlightEffects_content().stop().css({
      position: "absolute",
      "z-index": "2"
    }).animate(this.effects(), this.duration());
  };

  HighlightEffects.prototype._hoverOut = function() {
    var savedState, _ref;
    savedState = (_ref = this._originalState()) != null ? _ref : {};
    return this.$HighlightEffects_content().stop().css({
      "z-index": "1"
    }).animate(savedState, this.duration(), null, function() {
      return $(this).css({
        position: "inherit",
        "z-index": "inherit"
      });
    });
  };

  HighlightEffects.prototype._recalc = function() {
    this.height(this.$HighlightEffects_content().outerHeight());
    return this.width(this.$HighlightEffects_content().outerWidth());
  };

  return HighlightEffects;

})(Control);

/*
A text box that shows a "hint" as to what the user should enter.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.HintTextBox = (function(_super) {

  __extends(HintTextBox, _super);

  function HintTextBox() {
    HintTextBox.__super__.constructor.apply(this, arguments);
  }

  HintTextBox.prototype.inherited = {
    content: [
      {
        html: "<input type=\"text\" />",
        ref: "HintTextBox_textBox"
      }, {
        html: "<div/>",
        ref: "HintTextBox_hint"
      }
    ],
    generic: "true"
  };

  HintTextBox.prototype.content = Control.chain("$HintTextBox_textBox", "content", function() {
    return this._showHintIfEmpty();
  });

  HintTextBox.prototype.hint = Control.chain("$HintTextBox_hint", "content");

  HintTextBox.prototype.initialize = function() {
    var _this = this;
    this.on({
      click: function() {
        return _this._hideHint();
      },
      focus: function() {
        if (!_this._isTextBoxFocused()) {
          return _this.$HintTextBox_textBox().focus();
        }
      }
    });
    this.$HintTextBox_textBox().on({
      blur: function() {
        return _this._isTextBoxFocused(false)._showHintIfEmpty();
      },
      focus: function() {
        return _this._isTextBoxFocused(true);
      },
      keydown: function(event) {
        return _this._handleKeydown(event);
      },
      keyup: function() {
        return _this._showHintIfEmpty();
      }
    });
    return this.$HintTextBox_hint().click(function() {
      return _this._hideHint();
    });
  };

  HintTextBox.prototype._isTextBoxFocused = Control.property(null, false);

  HintTextBox.prototype._handleKeydown = function(event) {
    var keysOfUnknownEffect;
    keysOfUnknownEffect = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93, 144, 145, 182, 183];
    if ($.inArray(event.which, keysOfUnknownEffect) < 0) {
      return this.$HintTextBox_hint().hide();
    }
  };

  HintTextBox.prototype._hideHint = function() {
    this.$HintTextBox_hint().hide();
    return this.$HintTextBox_textBox().focus();
  };

  HintTextBox.prototype._showHintIfEmpty = function() {
    return this.$HintTextBox_hint().toggle(this.content().length === 0);
  };

  return HintTextBox;

})(Control);

/*
A labeled color swatch.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.LabeledColorSwatch = (function(_super) {

  __extends(LabeledColorSwatch, _super);

  function LabeledColorSwatch() {
    LabeledColorSwatch.__super__.constructor.apply(this, arguments);
  }

  LabeledColorSwatch.prototype.inherited = {
    content: [
      {
        control: "ColorSwatch",
        ref: "swatch"
      }, {
        html: "<div/>",
        ref: "ColorSwatchButton_content"
      }
    ]
  };

  LabeledColorSwatch.prototype.color = Control.chain("$swatch", "color");

  LabeledColorSwatch.prototype.content = Control.chain("$ColorSwatchButton_content", "content", function(content) {
    return this.$swatch().color(content);
  });

  return LabeledColorSwatch;

})(Control);

/*
An input control ( e.g., a check box or radio button ) with an associated label.

The control's top element is a label, which ensures that user clicks anywhere
within have the same effect as clicking the input control.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.LabeledInput = (function(_super) {

  __extends(LabeledInput, _super);

  function LabeledInput() {
    LabeledInput.__super__.constructor.apply(this, arguments);
  }

  LabeledInput.prototype.tag = "label";

  LabeledInput.prototype.inherited = {
    content: [
      "<input/>", {
        html: "<span/>",
        ref: "LabeledInput_content"
      }
    ]
  };

  LabeledInput.prototype.checked = Control.chain("_inputControl", "prop/checked");

  LabeledInput.prototype.content = Control.chain("$LabeledInput_content", "content");

  LabeledInput.prototype.disabled = Control.chain("_inputControl", "prop/disabled");

  LabeledInput.prototype._inputControl = Control.chain("children", "filter/input");

  LabeledInput.prototype._type = function(type) {
    var input, newInput, oldInput, _i, _len, _ref;
    input = this._inputControl();
    if ((type != null) && Control.browser.msie && parseInt(Control.browser.version) < 9) {
      _ref = input.segments();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        oldInput = _ref[_i];
        newInput = $("<input type='" + type + "'/>").prop({
          checked: oldInput.prop("checked"),
          disabled: oldInput.prop("disabled")
        });
        oldInput.replaceWith(newInput);
      }
      return this;
    } else {
      return input.prop("type", type);
    }
  };

  return LabeledInput;

})(Control);

/*
Lets user navigate content by moving left (backward) and right (forward).
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.LateralNavigator = (function(_super) {

  __extends(LateralNavigator, _super);

  function LateralNavigator() {
    LateralNavigator.__super__.constructor.apply(this, arguments);
  }

  LateralNavigator.prototype.inherited = {
    "class": "center",
    content: {
      control: "HorizontalPanels",
      ref: "panels",
      content: {
        html: "div",
        ref: "LateralNavigator_content"
      },
      left: {
        control: "BasicButton",
        ref: "LateralNavigator_previousButton",
        "class": "navigatorButton quiet",
        content: "&#9664;"
      },
      right: {
        control: "BasicButton",
        ref: "LateralNavigator_nextButton",
        "class": "navigatorButton quiet",
        content: "&#9654;"
      },
      tabindex: -1
    },
    generic: true
  };

  LateralNavigator.prototype.align = function(align) {
    this.toggleClass("center", align === "center");
    return this;
  };

  LateralNavigator.prototype.canGoNext = function() {
    return true;
  };

  LateralNavigator.prototype.canGoPrevious = function() {
    return true;
  };

  LateralNavigator.prototype.content = Control.chain("$LateralNavigator_content", "content", function() {
    return this._updateButtons();
  });

  LateralNavigator.prototype.contentClass = Control.property["class"](function(contentClass) {
    var $new;
    $new = this.$LateralNavigator_content().transmute(contentClass, true);
    return this.referencedElement("LateralNavigator_content", $new);
  });

  LateralNavigator.prototype.initialize = function() {
    var _this = this;
    this.$LateralNavigator_previousButton().click(function() {
      return _this._previousClick();
    });
    this.$LateralNavigator_nextButton().click(function() {
      return _this._nextClick();
    });
    this.on({
      keydown: function(event) {
        var handled;
        handled = false;
        switch (event.which) {
          case 37:
            if (!_this.$LateralNavigator_previousButton().disabled()) {
              _this._previousClick();
              handled = true;
            }
            break;
          case 39:
            if (!_this.$LateralNavigator_nextButton().disabled()) {
              _this._nextClick();
              handled = true;
            }
        }
        if (handled) {
          return false;
        }
      },
      sizeChanged: function() {
        _this.$panels().$SimpleFlexBox_panel1().checkForSizeChange();
        return _this.$panels().$SimpleFlexBox_panel2().checkForSizeChange();
      }
    });
    return this._updateButtons();
  };

  LateralNavigator.prototype.next = function() {};

  LateralNavigator.prototype.nextButtonContent = Control.chain("$LateralNavigator_nextButton", "content");

  LateralNavigator.prototype.nextButtonDisabled = Control.chain("$LateralNavigator_nextButton", "disabled");

  LateralNavigator.prototype.previous = function() {};

  LateralNavigator.prototype.previousButtonContent = Control.chain("$LateralNavigator_previousButton", "content");

  LateralNavigator.prototype.previousButtonDisabled = Control.chain("$LateralNavigator_previousButton", "disabled");

  LateralNavigator.prototype._nextClick = function() {
    this.next();
    this._updateButtons();
    return this.trigger("next");
  };

  LateralNavigator.prototype._previousClick = function() {
    this.previous();
    this._updateButtons();
    return this.trigger("previous");
  };

  LateralNavigator.prototype._updateButtons = function() {
    this.nextButtonDisabled(!this.canGoNext());
    return this.previousButtonDisabled(!this.canGoPrevious());
  };

  return LateralNavigator;

})(Control);

/*
Wraps an anchor tag.

Unlike a stock anchor tag, this will show a hand cursor even when the href
is empty, as is often the case with a link whose behavior is determined by
a click event handler.

The link will have the "current" style if it points to the current page.

This can also serve as a useful base class for custom link classes.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Link = (function(_super) {

  __extends(Link, _super);

  function Link() {
    Link.__super__.constructor.apply(this, arguments);
  }

  Link.prototype.current = Control.chain("applyClass/current");

  Link.prototype.href = Control.chain("prop/href", function() {
    return this._checkIfCurrent();
  });

  Link.prototype.initialize = function() {
    if (this.href()) {
      return this._checkIfCurrent();
    } else {
      return this.href("javascript:");
    }
  };

  Link.prototype.linksToArea = Control.property(function() {
    return this._checkIfCurrent();
  });

  Link.prototype.tag = "a";

  Link.prototype.target = Control.chain("prop/target");

  Link.prototype._checkIfCurrent = function() {
    var current, localPath, pathToMatch, pathname;
    localPath = this._localPath();
    current = localPath != null ? (pathname = window.location.pathname, pathToMatch = this.linksToArea() ? pathname.substring(0, localPath.length) : pathname, localPath === pathToMatch) : false;
    return this.current(current);
  };

  Link.prototype._localPath = function() {
    var href, origin;
    href = this.href();
    if (href == null) {
      return null;
    }
    origin = "" + window.location.protocol + "//" + window.location.hostname + "/";
    if (href.substring(0, origin.length) === origin) {
      return href.substring(origin.length - 1);
    } else {
      return href;
    }
  };

  return Link;

})(Control);

/*
Creates a set of controls, one for each item in a list.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.List = (function(_super) {

  __extends(List, _super);

  function List() {
    List.__super__.constructor.apply(this, arguments);
  }

  List.prototype.controls = function() {
    var itemClass;
    itemClass = this.itemClass();
    return (new itemClass(this)).children();
  };

  List.prototype.dirtyOnChange = Control.property.bool(null, false);

  List.prototype.initialize = function() {
    var _this = this;
    return this.change(function(event) {
      if (_this.dirtyOnChange()) {
        return _this.isDirty(true);
      }
    });
  };

  List.prototype.insertItemBefore = Control.iterator(function(item, index) {
    var $control, children, itemClass, items, _ref;
    itemClass = this.itemClass();
    $control = itemClass.create();
    this._mapAndSetup($control, item);
    children = this.children();
    if (index >= children.length) {
      this.append($control);
    } else {
      children.eq(index).before($control);
    }
    items = (_ref = this._itemsCache()) != null ? _ref : [];
    items.splice(index, 0, item);
    this._itemsCache(items);
    return this;
  });

  List.prototype.isDirty = Control.property.bool(null, true);

  List.prototype.itemClass = Control.property["class"](function() {
    var items;
    items = this.isDirty() ? this.items() : this._itemsCache();
    this.empty();
    return this.items(items);
  }, Control);

  List.prototype.items = function(items) {
    var itemsCopy;
    if (items === void 0) {
      if (this.isDirty()) {
        this._itemsCache(this._getItemsFromControls()).isDirty(false);
      }
      return this._itemsCache();
    } else {
      itemsCopy = items.slice(0);
      this._itemsCache(itemsCopy);
      this._createControlsForItems(itemsCopy);
      return this.isDirty(false);
    }
  };

  List.prototype.mapFunction = Control.property(function() {
    var items;
    items = this._itemsCache();
    return this.items(items);
  });

  List.prototype.removeItemAt = Control.iterator(function(index) {
    var items;
    items = this._itemsCache();
    if (index >= 0 && index < items.length) {
      this.children().eq(index).remove();
      items.splice(index, 1);
    }
    return this;
  });

  List._applyDictionaryMap = function(map, item) {
    var controlProperty, itemProperty, result, _results;
    if (item === void 0) {
      result = {};
      for (itemProperty in map) {
        controlProperty = map[itemProperty];
        result[itemProperty] = this[controlProperty]();
      }
      return result;
    } else {
      _results = [];
      for (itemProperty in map) {
        controlProperty = map[itemProperty];
        _results.push(this[controlProperty](item[itemProperty]));
      }
      return _results;
    }
  };

  List.prototype._createControlsForItems = function(items) {
    var $control, $existingControls, existingControlsCount, i, itemClass, itemsCount, leftoverControls, mapFunction, newControls;
    itemsCount = items.length;
    itemClass = this.itemClass();
    mapFunction = this._getMapFunction();
    $existingControls = this.controls();
    existingControlsCount = $existingControls.length;
    $control = void 0;
    i = 0;
    while (i < itemsCount && i < existingControlsCount) {
      $control = $existingControls.eq(i);
      this._mapAndSetup($control, items[i], mapFunction);
      i++;
    }
    newControls = [];
    while (i < itemsCount) {
      $control = itemClass.create();
      this._mapAndSetup($control, items[i], mapFunction);
      newControls.push($control[0]);
      i++;
    }
    if (newControls.length > 0) {
      this.append.apply(this, newControls);
    }
    leftoverControls = $existingControls.slice(items.length);
    if (leftoverControls.length > 0) {
      $(leftoverControls).remove();
    }
    return this;
  };

  List._defaultMapFunction = function(item) {
    var key, map;
    map = void 0;
    if (item === void 0) {
      map = this.data("_map");
      if (map != null) {
        return List._applyDictionaryMap.call(this, map);
      } else {
        return this.content();
      }
    } else {
      if ($.isPlainObject(item)) {
        map = {};
        for (key in item) {
          if (item.hasOwnProperty(key)) {
            map[key] = key;
          }
        }
        this.data("_map", map);
        return List._applyDictionaryMap.call(this, map, item);
      } else {
        return this.content(item);
      }
    }
  };

  List.prototype._getItemsFromControls = function() {
    var control, mapFunction, _i, _len, _ref, _results;
    mapFunction = this._getMapFunction();
    _ref = this.controls().segments();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      control = _ref[_i];
      _results.push(mapFunction.call(control));
    }
    return _results;
  };

  List.prototype._getMapFunction = function() {
    var mapFunction;
    mapFunction = this.mapFunction();
    if (mapFunction === void 0) {
      return List._defaultMapFunction;
    } else if (typeof mapFunction === "string") {
      return function(item) {
        return this[mapFunction](item);
      };
    } else if ($.isFunction(mapFunction)) {
      return mapFunction;
    } else {
      return function(item) {
        return List._applyDictionaryMap.call(this, mapFunction, item);
      };
    }
  };

  List.prototype._itemsCache = Control.property();

  List.prototype._mapAndSetup = function($control, item, mapFunction) {
    if (mapFunction === void 0) {
      mapFunction = this._getMapFunction();
    }
    mapFunction.call($control, item);
    return this._setupControl($control);
  };

  List.prototype._setupControl = function($control) {};

  return List;

})(Control);

/*
A list box that allows single selection.
The user can select an item with the mouse or keyboard.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ListBox = (function(_super) {

  __extends(ListBox, _super);

  function ListBox() {
    ListBox.__super__.constructor.apply(this, arguments);
  }

  ListBox.prototype.inherited = {
    generic: "true"
  };

  ListBox.prototype.deselectOnBackgroundClick = Control.property.bool(null, true);

  ListBox.prototype.highlightSelection = Control.property.bool(function(highlightSelection) {
    return this.toggleClass("highlightSelection", highlightSelection);
  });

  ListBox.prototype.initialize = function() {
    var _this = this;
    this.attr("tabindex", "-1");
    this.on({
      click: function(event) {
        var control;
        if (event.target === _this[0]) {
          if (_this.deselectOnBackgroundClick()) {
            return _this.selectedControl(null);
          }
        } else {
          control = _this._getControlContainingElement(event.target);
          if (control != null) {
            return _this._controlClick(control);
          }
        }
      },
      keydown: function(event) {
        return _this._keydown(event);
      }
    });
    if (this.highlightSelection() === void 0) {
      return this.highlightSelection(true);
    }
  };

  ListBox.prototype.items = function(value) {
    var index, previousIndex, result;
    previousIndex = this.selectedIndex();
    result = ListBox.__super__.items.call(this, value);
    if (value !== void 0 && value.length > 0) {
      index = previousIndex >= 0 && previousIndex < value.length ? previousIndex : -1;
      this.selectedIndex(index);
    }
    return result;
  };

  ListBox.prototype.selectControl = function(control, select) {
    control.toggleClass("selected", select);
    if ($.isFunction(control.selected)) {
      return control.selected(select);
    }
  };

  ListBox.prototype.selectedControl = Control.iterator(function(selectedControl) {
    var control, previousControl, selectedElement, _i, _len, _ref;
    if (selectedControl === void 0) {
      control = this.controls().filter(".selected").eq(0);
      if (control.length > 0) {
        return control;
      } else {
        return null;
      }
    } else {
      previousControl = this.selectedControl();
      selectedElement = selectedControl ? selectedControl[0] : null;
      _ref = this.controls().segments();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        control = _ref[_i];
        this.selectControl(control, control[0] === selectedElement);
      }
      if (selectedControl != null) {
        this._scrollToControl(selectedControl);
      }
      if (selectedControl !== previousControl) {
        this.trigger("selectionChanged");
      }
      return this;
    }
  });

  ListBox.prototype.selectedIndex = Control.iterator(function(selectedIndex) {
    var control, controls, index;
    controls = this.controls();
    if (selectedIndex === void 0) {
      control = this.selectedControl();
      if (control) {
        return controls.index(control);
      } else {
        return -1;
      }
    } else {
      index = parseInt(selectedIndex);
      control = index >= 0 && index < controls.length ? controls.eq(index) : null;
      this.selectedControl(control);
      return this;
    }
  });

  ListBox.prototype.selectedItem = Control.iterator(function(selectedItem) {
    var index;
    if (selectedItem === void 0) {
      index = this.selectedIndex();
      if (index >= 0) {
        return this.items()[index];
      } else {
        return null;
      }
    } else {
      index = $.inArray(selectedItem, this.items());
      return this.selectedIndex(index);
    }
  });

  ListBox.prototype._controlClick = function(control) {
    return this.selectedControl(control);
  };

  ListBox.prototype._getControlContainingElement = function(element) {
    return $(element).closest(this.controls()).control();
  };

  ListBox.prototype._getControlAtY = function(y, downward) {
    var $control, controlBottom, controlTop, controls, end, i, start, step;
    controls = this.controls();
    start = downward ? 0 : controls.length - 1;
    end = downward ? controls.length : 0;
    step = downward ? 1 : -1;
    i = start;
    while (i !== end) {
      $control = controls.eq(i);
      controlTop = Math.round($control.offset().top);
      controlBottom = controlTop + $control.outerHeight();
      if (controlTop <= y && controlBottom >= y) {
        return i;
      }
      i += step;
    }
    return -1;
  };

  ListBox.prototype._keydown = function(event) {
    var handled;
    handled = void 0;
    switch (event.which) {
      case 33:
        handled = this._pageUp();
        break;
      case 34:
        handled = this._pageDown();
        break;
      case 35:
        handled = this._selectLastControl();
        break;
      case 36:
        handled = this._selectFirstControl();
        break;
      case 37:
        if (this._selectedControlIsInline()) {
          handled = this._selectPreviousControl();
        }
        break;
      case 38:
        handled = event.altKey ? this._selectFirstControl() : this._selectPreviousControl();
        break;
      case 39:
        if (this._selectedControlIsInline()) {
          handled = this._selectNextControl();
        }
        break;
      case 40:
        handled = event.altKey ? this._selectLastControl() : this._selectNextControl();
        break;
      default:
        handled = false;
    }
    if (handled) {
      event.stopPropagation();
      return event.preventDefault();
    }
  };

  ListBox.prototype._pageDown = function() {
    return this._scrollOnePage(true);
  };

  ListBox.prototype._pageUp = function() {
    return this._scrollOnePage(false);
  };

  ListBox.prototype._scrollOnePage = function(downward) {
    var delta, edge, index, selectedIndex, viewPortDimensions;
    selectedIndex = this.selectedIndex();
    viewPortDimensions = this._viewPortDimensions();
    edge = downward ? viewPortDimensions.bottom : viewPortDimensions.top;
    index = this._getControlAtY(edge, downward);
    if (index >= 0 && selectedIndex === index) {
      delta = downward ? viewPortDimensions.height : -viewPortDimensions.height;
      index = this._getControlAtY(edge + delta, downward);
    }
    if (index < 0) {
      index = (downward ? this.controls().length - 1 : 0);
    }
    if (index !== this.selectedIndex()) {
      this.selectedIndex(index);
      return true;
    } else {
      return false;
    }
  };

  ListBox.prototype._scrollToControl = function($control) {
    var controlBottom, controlTop, scrollTop, viewPortDimensions;
    controlTop = $control.offset().top;
    controlBottom = controlTop + $control.outerHeight();
    viewPortDimensions = this._viewPortDimensions();
    scrollTop = this.scrollTop();
    if (controlBottom > viewPortDimensions.bottom) {
      return this.scrollTop(scrollTop + controlBottom - viewPortDimensions.bottom);
    } else if (controlTop < viewPortDimensions.top) {
      return this.scrollTop(scrollTop - (viewPortDimensions.top - controlTop));
    }
  };

  ListBox.prototype._selectedControlIsInline = function() {
    var display, selectedControl;
    selectedControl = this.selectedControl();
    if (selectedControl != null) {
      display = selectedControl.css("display");
      return $.inArray(display, ["inline", "inline-block", "inline-table"]) >= 0;
    } else {
      return false;
    }
  };

  ListBox.prototype._selectFirstControl = function() {
    if (this.controls().length > 0) {
      this.selectedIndex(0);
      this.scrollTop(0);
      return true;
    } else {
      return false;
    }
  };

  ListBox.prototype._selectLastControl = function() {
    if (this.controls().length > 0) {
      this.selectedIndex(this.controls().length - 1);
      return true;
    } else {
      return false;
    }
  };

  ListBox.prototype._selectNextControl = function() {
    var index;
    index = this.selectedIndex() + 1;
    if (index < this.controls().length) {
      this.selectedIndex(index);
      return true;
    } else {
      return false;
    }
  };

  ListBox.prototype._selectPreviousControl = function() {
    var index;
    index = this.selectedIndex() - 1;
    if (index >= 0 && this.controls().length > 0) {
      this.selectedIndex(index);
      return true;
    } else {
      return false;
    }
  };

  ListBox.prototype._viewPortDimensions = function() {
    var viewPortHeight, viewPortTop;
    viewPortTop = this.offset().top;
    viewPortHeight = this.height();
    return {
      top: viewPortTop,
      height: viewPortHeight,
      bottom: viewPortTop + viewPortHeight
    };
  };

  return ListBox;

})(List);

/*
A list whose selected item can show additional information.

By default, this control expects items to be a dictionary of the form:

{
  description: ( content, usually a single line, that's always visible )
  content: ( expanded content that appears when an item is selected )
}
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ListInlay = (function(_super) {

  __extends(ListInlay, _super);

  function ListInlay() {
    ListInlay.__super__.constructor.apply(this, arguments);
  }

  ListInlay.prototype.inherited = {
    highlightSelection: "false",
    itemClass: "Collapsible"
  };

  ListInlay.prototype.initialize = function() {
    return this.mapFunction({
      description: "heading",
      content: "content"
    });
  };

  ListInlay.prototype.selectControl = function(control, select) {
    ListInlay.__super__.selectControl.call(this, control, select);
    if (select) {
      return control.toggleCollapse();
    } else {
      return control.collapsed(true);
    }
  };

  ListInlay.prototype._setupControl = function(control) {
    return control.toggleOnClick(false);
  };

  return ListInlay;

})(ListBox);

/*
A simple text-based log.
This can be used, e.g., for displaying the text output of ongoing processes.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Log = (function(_super) {

  __extends(Log, _super);

  function Log() {
    Log.__super__.constructor.apply(this, arguments);
  }

  Log.prototype.inherited = {
    content: [
      {
        html: "pre",
        ref: "Log_content"
      }
    ]
  };

  Log.prototype.clear = function() {
    return this.content("");
  };

  Log.prototype.content = Control.chain("$Log_content", "content");

  Log.prototype.write = function(s) {
    var content;
    content = this.content();
    if (content.length === 0) {
      content = "";
    }
    this.content(content + s);
    return this.scrollTop(this.$Log_content().outerHeight());
  };

  Log.prototype.writeln = function(s) {
    s = s != null ? s : "";
    return this.write(s + "\n");
  };

  return Log;

})(Control);

/*
Generates Lorem Ipsum placeholder paragraphs.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.LoremIpsum = (function(_super) {

  __extends(LoremIpsum, _super);

  function LoremIpsum() {
    LoremIpsum.__super__.constructor.apply(this, arguments);
  }

  LoremIpsum.prototype.initialize = function() {
    var _ref;
    if (!LoremIpsum._usedLorem) {
      this.lorem(true);
      LoremIpsum._usedLorem = true;
    }
    if (((_ref = this.content()) != null ? _ref.length : void 0) === 0) {
      return this._refresh();
    }
  };

  LoremIpsum.prototype.lorem = Control.property.bool(function() {
    return this._refresh();
  });

  LoremIpsum.loremSentence = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  LoremIpsum.prototype.paragraphs = Control.property.integer(function(paragraphs) {
    return this._refresh();
  }, 1);

  LoremIpsum.prototype.sentences = Control.property.integer(function(sentences) {
    return this._refresh();
  });

  LoremIpsum.sentences = ["Duis et adipiscing mi.", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", "Mauris vestibulum orci sed justo lobortis viverra.", "Suspendisse blandit dolor nunc, nec facilisis metus.", "Ut vestibulum ornare eros id vestibulum.", "Phasellus aliquam pellentesque urna, eu ullamcorper odio sollicitudin vel.", "Aliquam lacinia dolor at elit viverra ullamcorper.", "Vestibulum ac quam augue.", "Fusce tortor risus, commodo in molestie vitae, rutrum eu metus.", "Nunc tellus justo, consequat in ultrices elementum, gravida a mi.", "Praesent in lorem erat, quis dictum magna.", "Aenean et eros ligula, quis sodales justo.", "Quisque egestas imperdiet dignissim.", "Aenean commodo nulla sit amet urna ornare quis dignissim libero tristique.", "Praesent non justo metus.", "Nam ut adipiscing enim.", "In hac habitasse platea dictumst.", "Nulla et enim sit amet leo laoreet lacinia ut molestie magna.", "Vestibulum bibendum venenatis eros sit amet eleifend.", "Fusce eget metus orci.", "Fusce tincidunt laoreet lacinia.", "Proin a arcu purus, nec semper quam.", "Mauris viverra vestibulum sagittis.", "Ut commodo, dolor malesuada aliquet lacinia, dui est congue massa, vel sagittis metus quam vel elit.", "Nulla vel condimentum odio.", "Aliquam cursus velit ut tellus ultrices rutrum.", "Vivamus sollicitudin rhoncus purus, luctus lobortis dui viverra vitae.", "Nam mauris elit, aliquet at congue sed, volutpat feugiat eros.", "Nulla quis nulla ac lectus dapibus viverra.", "Pellentesque commodo mauris vitae sapien molestie sit amet pharetra quam pretium.", "Maecenas scelerisque rhoncus risus, in pharetra dui euismod ac.", "Mauris ut turpis sapien, sed molestie odio.", "Vivamus nec lectus nunc, vel ultricies felis.", "Mauris iaculis rhoncus dictum.", "Vivamus at mi tellus.", "Etiam nec dui eu risus placerat adipiscing non at nisl.", "Curabitur commodo nunc accumsan purus hendrerit mollis.", "Fusce lacinia urna nec eros consequat sed tempus mi rhoncus.", "Morbi eu tortor sit amet tortor elementum dapibus.", "Suspendisse tincidunt lorem quis urna sollicitudin lobortis.", "Nam eu ante ut tellus vulputate ultrices eu sed mi.", "Aliquam lobortis ultricies urna, in imperdiet lacus tempus a.", "Duis nec velit eros, ut volutpat neque.", "Sed quam purus, tempus vitae porta eget, porta sit amet eros.", "Vestibulum dignissim ullamcorper est id molestie.", "Nunc erat ante, lobortis id dictum in, ultrices sit amet nisl.", "Nunc blandit pellentesque sapien, quis egestas risus auctor quis.", "Fusce quam quam, ultrices quis convallis sed, pulvinar auctor tellus.", "Etiam dolor velit, hendrerit et auctor sit amet, ornare nec erat.", "Nam tellus mi, rutrum a pretium et, dignissim sed sapien.", "Sed accumsan dapibus ipsum ut facilisis.", "Curabitur vel diam massa, ut ultrices est.", "Sed nec nunc arcu.", "Nullam lobortis, enim nec gravida molestie, orci risus blandit orci, et suscipit nunc odio eget nisl.", "Praesent lectus tellus, gravida ut sagittis non, convallis a leo.", "Mauris tempus feugiat fermentum.", "Phasellus nibh mi, convallis eu pulvinar eget, posuere in nunc.", "Morbi volutpat laoreet mauris vel porta.", "Aenean vel venenatis nisi.", "Ut tristique mauris sed libero malesuada quis rhoncus augue convallis.", "Fusce pellentesque turpis arcu.", "Nunc bibendum, odio id faucibus malesuada, diam leo congue urna, sed sodales orci turpis id sem.", "Ut convallis fringilla dapibus.", "Ut quis orci magna.", "Mauris nec erat massa, vitae pellentesque tortor.", "Sed in ipsum nec enim feugiat aliquam et id arcu.", "Nunc ut massa sit amet nisl semper ultrices eu id lacus.", "Integer eleifend aliquam interdum.", "Cras a sapien sapien.", "Duis non orci lacus.", "Integer commodo pharetra nulla eget ultrices.", "Etiam congue, enim at vehicula posuere, urna lorem hendrerit erat, id condimentum quam lectus ac ipsum.", "Aliquam lorem purus, tempor ac mollis in, varius eget metus.", "Nam faucibus accumsan sapien vitae ultrices.", "Morbi justo velit, bibendum non porta vel, tristique quis odio.", "In id neque augue.", "Cras interdum felis sed dui ultricies laoreet sit amet eu elit.", "Vestibulum condimentum arcu in massa lobortis vitae blandit neque mattis.", "Nulla imperdiet luctus mollis.", "Donec eget lorem ipsum, eu posuere mi.", "Duis lorem est, iaculis sit amet molestie a, tincidunt rutrum magna.", "Integer facilisis suscipit tortor, id facilisis urna dictum et.", "Suspendisse potenti.", "Aenean et mollis arcu.", "Nullam at nulla risus, vitae fermentum nisl.", "Nunc faucibus porta volutpat.", "Sed pretium semper libero, vitae luctus erat lacinia vel.", "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", "Integer facilisis tempus tellus, rhoncus pretium orci semper sed.", "Morbi non lectus leo, quis semper diam.", "Suspendisse ac urna massa, vitae egestas metus.", "Pellentesque viverra mattis semper.", "Cras tristique bibendum leo, laoreet ultrices urna condimentum at.", "Praesent at tincidunt velit.", "Nam fringilla nibh quis nulla volutpat lacinia.", "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.", "Sed ultrices sollicitudin neque ut molestie.", "Sed at lectus in lacus scelerisque suscipit non id risus.", "Aliquam lorem nibh, convallis vitae molestie in, commodo feugiat nibh."];

  LoremIpsum.prototype._generateParagraph = function(useLorem) {
    var i, paragraph, sentenceCount, sentenceIndex, sentencesAvailable, _i, _ref;
    sentenceCount = this.sentences() || Math.floor(Math.random() * 8) + 5;
    sentencesAvailable = LoremIpsum.sentences.length;
    paragraph = "";
    if (sentenceCount > 0) {
      if (useLorem) {
        paragraph = LoremIpsum.loremSentence;
        sentenceCount--;
      }
      for (i = _i = 0, _ref = sentenceCount - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (paragraph.length > 0) {
          paragraph += " ";
        }
        sentenceIndex = Math.floor(Math.random() * sentencesAvailable);
        paragraph += LoremIpsum.sentences[sentenceIndex];
      }
    }
    return "<p>" + paragraph + "</p>";
  };

  LoremIpsum.prototype._refresh = function() {
    var content, i, useLorem;
    content = (function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.paragraphs() - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        useLorem = i === 0 && this.lorem();
        _results.push(this._generateParagraph(useLorem));
      }
      return _results;
    }).call(this);
    return this.content(content);
  };

  LoremIpsum._usedLorem = false;

  return LoremIpsum;

})(Control);

/*
A standard menu bar.

Note: The menu bar places a Overlay instance underneath itself to absorb
clicks outside the menu. If you're using a MenuBar on a page with elements
that have an explicit z-index, you'll want to give the MenuBar a higher z-index
so that it ( and its overlay ) end up above all other elements when any menus
are open. See notes in the source for the Overlay class.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MenuBar = (function(_super) {

  __extends(MenuBar, _super);

  function MenuBar() {
    MenuBar.__super__.constructor.apply(this, arguments);
  }

  MenuBar.prototype.inherited = {
    generic: "true"
  };

  MenuBar.prototype.close = Control.iterator(function() {
    var $overlay;
    if (!this.opened()) {
      return;
    }
    $overlay = this._overlay();
    if ($overlay) {
      $overlay.remove();
      this._overlay(null);
    }
    return this._closeOpenPopups().opened(false);
  });

  MenuBar.prototype.content = function(content) {
    var popups, result;
    result = MenuBar.__super__.content.call(this, content);
    if (content !== void 0) {
      popups = this.find(".PopupSource").control();
      if (popups) {
        popups.overlayClass(null);
      }
    }
    return result;
  };

  MenuBar.prototype.initialize = function() {
    var _this = this;
    this.on({
      "closed canceled": function(event) {
        if (_this._openPopups() == null) {
          return _this.close();
        }
      },
      opened: function(event) {
        var newMenu;
        _this.open();
        newMenu = $(event.target).closest(".PopupSource").control();
        return _this._closeOpenPopups(newMenu);
      }
    });
    return this.on("mouseenter", ".PopupSource", function(event) {
      var newMenu;
      if (_this.opened()) {
        newMenu = $(event.target).closest(".PopupSource").control();
        if (newMenu && !newMenu.opened()) {
          return newMenu.open();
        }
      }
    });
  };

  MenuBar.prototype.opened = Control.chain("applyClass/opened");

  MenuBar.prototype.open = Control.iterator(function() {
    var $overlay;
    if (this.opened()) {
      return;
    }
    $overlay = Overlay.create().target(this);
    this._overlay($overlay);
    this.opened(true);
    return this;
  });

  MenuBar.prototype._closeOpenPopups = function(keepPopup) {
    var openMenus;
    openMenus = this._openPopups();
    if (openMenus) {
      openMenus = openMenus.not(keepPopup);
      if (openMenus.length > 0) {
        openMenus.close();
      }
    }
    return this;
  };

  MenuBar.prototype._openPopups = Control.chain("children", "filter/.PopupSource.opened", "control");

  MenuBar.prototype._overlay = Control.property();

  MenuBar.prototype._requiredClasses = ["Menu", "Overlay"];

  return MenuBar;

})(Control);

/*
A command in a Menu.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MenuItem = (function(_super) {

  __extends(MenuItem, _super);

  function MenuItem() {
    MenuItem.__super__.constructor.apply(this, arguments);
  }

  MenuItem.prototype.inherited = {
    generic: "true"
  };

  MenuItem.prototype.disabled = Control.chain("applyClass/disabled");

  MenuItem.prototype.initialize = function() {
    var _this = this;
    return this.click(function(event) {
      if (_this.disabled()) {
        return false;
      }
    });
  };

  return MenuItem;

})(Control);

/*
A line separating the MenuItems controls in a Menu.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MenuSeparator = (function(_super) {

  __extends(MenuSeparator, _super);

  function MenuSeparator() {
    MenuSeparator.__super__.constructor.apply(this, arguments);
  }

  return MenuSeparator;

})(Control);

/*
A link in a mobile application, typically in a list.
After a tap, the link will hold a "tapFeedback" for a short duration.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MobileLink = (function(_super) {

  __extends(MobileLink, _super);

  function MobileLink() {
    MobileLink.__super__.constructor.apply(this, arguments);
  }

  MobileLink.prototype.initialize = function() {
    var _this = this;
    return this.click(function() {
      _this.addClass("tapFeedback");
      return setTimeout((function() {
        return _this.removeClass("tapFeedback");
      }), 250);
    });
  };

  return MobileLink;

})(Link);

/*
A list of links on a mobile device.

Note, while the items in the list will appear (and should behave) like links,
they don't actually have to be implemented links (e.g., as anchor tags or Link
controls.)

This currently uses an iOS visual style.
TODO: Detect Android and use appropriate Android style.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MobileLinkList = (function(_super) {

  __extends(MobileLinkList, _super);

  function MobileLinkList() {
    MobileLinkList.__super__.constructor.apply(this, arguments);
  }

  MobileLinkList.prototype.tag = "ul";

  return MobileLinkList;

})(List);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MobileListBox = (function(_super) {

  __extends(MobileListBox, _super);

  function MobileListBox() {
    MobileListBox.__super__.constructor.apply(this, arguments);
  }

  MobileListBox.prototype.inherited = {
    itemClass: "MobileLink"
  };

  MobileListBox.prototype.tag = "ul";

  return MobileListBox;

})(ListBox);

/*
Shows the name of the current month and the year
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MonthAndYear = (function(_super) {

  __extends(MonthAndYear, _super);

  function MonthAndYear() {
    MonthAndYear.__super__.constructor.apply(this, arguments);
  }

  MonthAndYear.prototype.inherited = {
    content: [
      {
        control: "MonthName",
        ref: "monthName"
      }, " ", {
        html: "span",
        ref: "year"
      }
    ],
    generic: true
  };

  MonthAndYear.prototype.culture = function(culture) {
    var result;
    result = MonthAndYear.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.$monthName().culture(culture);
    }
    return result;
  };

  MonthAndYear.prototype.date = Control.property.date(function(date) {
    this.$monthName().month(date.getMonth());
    return this.$year().content(date.getFullYear());
  });

  MonthAndYear.prototype.initialize = function() {
    if (!this.date()) {
      return this.date(new Date());
    }
  };

  return MonthAndYear;

})(Control);

/*
The name of the current month, globalized.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MonthName = (function(_super) {

  __extends(MonthName, _super);

  function MonthName() {
    MonthName.__super__.constructor.apply(this, arguments);
  }

  MonthName.prototype.tag = "span";

  MonthName.prototype.culture = function(culture) {
    var result;
    result = MonthName.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.month(this.month());
    }
    return result;
  };

  MonthName.prototype.initialize = function() {
    var today;
    if (!this.month()) {
      today = new Date();
      return this.month(today.getMonth());
    }
  };

  MonthName.prototype.month = Control.property(function(month) {
    var culture, monthNameEnum;
    culture = this.culture();
    monthNameEnum = culture ? culture.calendar.months.names : MonthName.names;
    return this.content(monthNameEnum[month]);
  });

  MonthName.names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return MonthName;

})(Control);

/*
A ListBox capable of multiple selection.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MultiListBox = (function(_super) {

  __extends(MultiListBox, _super);

  function MultiListBox() {
    MultiListBox.__super__.constructor.apply(this, arguments);
  }

  MultiListBox.prototype.selectedControls = Control.iterator(function(selectedControls) {
    var $selectedControls, control, filter, select, _i, _len, _ref;
    if (selectedControls === void 0) {
      return this.controls().filter(".selected");
    } else {
      $selectedControls = $(selectedControls);
      _ref = this.controls().segments();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        control = _ref[_i];
        filter = $selectedControls.filter(control);
        select = filter && filter.length > 0;
        this.selectControl(control, select);
      }
      return this.trigger("selectionChanged");
    }
  });

  MultiListBox.prototype.selectedIndices = Control.iterator(function(selectedIndices) {
    var controls, i, index, selectedControls, _i, _ref, _results;
    controls = this.controls();
    if (selectedIndices === void 0) {
      _results = [];
      for (i = _i = 0, _ref = controls.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        if (controls.eq(i).hasClass("selected")) {
          _results.push(i);
        }
      }
      return _results;
    } else {
      selectedControls = (function() {
        var _j, _len, _ref1, _results1;
        _ref1 = selectedIndices != null ? selectedIndices : [];
        _results1 = [];
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          index = _ref1[_j];
          _results1.push(controls[index]);
        }
        return _results1;
      })();
      return this.selectedControls(selectedControls);
    }
  });

  MultiListBox.prototype.selectedItems = Control.iterator(function(selectedItems) {
    var controls, index, item, items, selectedControls, selectedIndices, _i, _len, _ref, _results;
    items = this.items();
    if (selectedItems === void 0) {
      _ref = this.selectedIndices();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        index = _ref[_i];
        _results.push(items[index]);
      }
      return _results;
    } else {
      controls = this.controls();
      selectedIndices = (function() {
        var _j, _len1, _ref1, _results1;
        _ref1 = selectedItems != null ? selectedItems : [];
        _results1 = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          item = _ref1[_j];
          _results1.push($.inArray(item, items));
        }
        return _results1;
      })();
      selectedControls = (function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (_j = 0, _len1 = selectedIndices.length; _j < _len1; _j++) {
          index = selectedIndices[_j];
          if (index >= 0) {
            _results1.push(controls[index]);
          }
        }
        return _results1;
      })();
      return this.selectedControls(selectedControls);
    }
  });

  MultiListBox.prototype.toggleControl = function(control, toggle) {
    toggle = toggle != null ? toggle : !control.hasClass("selected");
    this.selectControl(control, toggle);
    this.trigger("selectionChanged");
    return this;
  };

  MultiListBox.prototype._controlClick = function(control) {
    return this.toggleControl(control);
  };

  return MultiListBox;

})(ListBox);

/*
A list whose selected items can show additional information.

By default, this control expects items to be a dictionary of the form:

{
  description: ( content, usually a single line, that's always visible )
  content: ( expanded content that appears when an item is selected )
}

This is the multiple-selection variation of ListInlay.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MultiListInlay = (function(_super) {

  __extends(MultiListInlay, _super);

  function MultiListInlay() {
    MultiListInlay.__super__.constructor.apply(this, arguments);
  }

  MultiListInlay.prototype.inherited = {
    highlightSelection: "false",
    itemClass: "CollapsibleWithHeadingButton"
  };

  MultiListInlay.prototype.initialize = function() {
    return this.mapFunction(function(item) {
      if (item === void 0) {
        return {
          description: this.heading(),
          content: this.content()
        };
      } else {
        this.heading(item.description).content(item.content);
        if (this instanceof Collapsible) {
          return this.toggleOnClick(false);
        }
      }
    });
  };

  MultiListInlay.prototype.selectControl = function(control, select) {
    MultiListInlay.__super__.selectControl.call(this, control, select);
    return control.collapsed(!select);
  };

  return MultiListInlay;

})(MultiListBox);

/*
A control that covers the entire viewport, typically to swallow clicks.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Overlay = (function(_super) {

  __extends(Overlay, _super);

  function Overlay() {
    Overlay.__super__.constructor.apply(this, arguments);
  }

  Overlay.prototype.inherited = {
    generic: true
  };

  Overlay.prototype.target = Control.property(function(target) {
    var targetZIndex;
    if (target === null) {
      return;
    }
    targetZIndex = parseInt(target.css("z-index"));
    if (targetZIndex) {
      this.css("z-index", targetZIndex);
    }
    return this.insertBefore(target);
  });

  return Overlay;

})(Control);

/*
Pack children into columns.

The number of columns is variable, and is determined by diving the control's
available width by the column width ( which is taken from the width of the
first child ).
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.PackedColumns = (function(_super) {

  __extends(PackedColumns, _super);

  function PackedColumns() {
    PackedColumns.__super__.constructor.apply(this, arguments);
  }

  PackedColumns.prototype.center = Control.property.bool(function() {
    if (this.inDocument()) {
      return this.layout();
    }
  });

  PackedColumns.prototype.content = function(value) {
    var result;
    result = PackedColumns.__super__.content.call(this, value);
    this.checkForSizeChange();
    return result;
  };

  PackedColumns.prototype.initialize = function() {
    var _this = this;
    return this.on("layout sizeChanged", function() {
      return _this.layout();
    });
  };

  PackedColumns.prototype.layout = function() {
    var availableWidth, child, children, column, columnHeight, columnWidth, columns, consumedWidth, firstChild, height, leftover, marginBottom, marginRight, offsetX, shortestColumn, x, y, _i, _j, _len, _ref, _ref1, _ref2, _results;
    children = this.children();
    if (!(children.length > 0)) {
      return;
    }
    firstChild = children.eq(0);
    columnWidth = firstChild.outerWidth();
    if (columnWidth === 0) {
      return;
    }
    marginRight = parseInt(firstChild.css("margin-right"));
    marginBottom = parseInt(firstChild.css("margin-bottom"));
    availableWidth = this.width();
    columns = Math.max(Math.floor((availableWidth + marginRight) / (columnWidth + marginRight)), 1);
    consumedWidth = columns * columnWidth + (columns - 1) * marginRight;
    leftover = Math.max(availableWidth - consumedWidth, 0);
    offsetX = this.center() ? leftover / 2 : 0;
    columnHeight = [];
    _ref = children.segments();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      shortestColumn = 0;
      for (column = _j = 1, _ref1 = columns - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; column = 1 <= _ref1 ? ++_j : --_j) {
        height = columnHeight[column] || 0;
        if (height < columnHeight[shortestColumn]) {
          shortestColumn = column;
        }
      }
      x = shortestColumn * (columnWidth + marginRight) + offsetX;
      y = (_ref2 = columnHeight[shortestColumn]) != null ? _ref2 : 0;
      child.css({
        left: x,
        top: y
      });
      _results.push(columnHeight[shortestColumn] = y + child.outerHeight() + marginBottom);
    }
    return _results;
  };

  return PackedColumns;

})(Control);

/*
General base class for pages.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Page = (function(_super) {

  __extends(Page, _super);

  function Page() {
    Page.__super__.constructor.apply(this, arguments);
  }

  Page.prototype.inherited = {
    generic: "true"
  };

  Page.prototype.fill = Control.chain("applyClass/fill");

  Page.prototype.initialize = function() {
    return this.title(this.title());
  };

  Page.prototype.title = function(title) {
    if (this[0] === document.body) {
      if (title === void 0) {
        return document.title;
      } else {
        document.title = title;
        return this;
      }
    } else {
      return this._title(title);
    }
  };

  Page.trackClassFromUrl = function(defaultPageClass, target) {
    var $control;
    $control = Control(target != null ? target : "body");
    $(window).on("hashchange", function() {
      var pageClass, _ref;
      pageClass = (_ref = Page.urlParameters().page) != null ? _ref : defaultPageClass;
      return $control.transmute(pageClass);
    });
    return $(window).trigger("hashchange");
  };

  Page.prototype.urlParameters = function() {
    return Page.urlParameters();
  };

  Page.urlParameters = function() {
    var fullMatch, match, parameterName, parameterValue, regex, results;
    regex = /[?#&](\w+)=([^?#&]*)/g;
    results = {};
    match = regex.exec(window.location.href);
    while (match != null) {
      fullMatch = match[0], parameterName = match[1], parameterValue = match[2];
      results[parameterName] = parameterValue;
      match = regex.exec(window.location.href);
    }
    return results;
  };

  Page.prototype._title = Control.property();

  return Page;

})(Control);

Control.prototype.page = function() {
  var pages;
  pages = this.closest(".Page");
  if (pages.length > 0) {
    return pages.control();
  } else {
    return null;
  }
};

/*
A page organized into four quadrants:
top left: typically a logo
top right: typically cross-area navigation
bottom left: typically within-area navigation
bottom right: typically main page content

The whole page scrolls as a unit.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.PageWithQuadrants = (function(_super) {

  __extends(PageWithQuadrants, _super);

  function PageWithQuadrants() {
    PageWithQuadrants.__super__.constructor.apply(this, arguments);
  }

  PageWithQuadrants.prototype.inherited = {
    content: [
      {
        html: "<div class=\"table\" />",
        ref: "pageTable",
        content: [
          {
            html: "<div class=\"top row\" />",
            content: [
              {
                html: "<div class=\"top left cell\" />",
                ref: "PageWithQuadrants_topLeft"
              }, {
                html: "<div class=\"top right cell\" />",
                ref: "PageWithQuadrants_topRight"
              }
            ]
          }, {
            html: "<div class=\"bottom row\" />",
            content: [
              {
                html: "<div class=\"bottom left cell\" />",
                ref: "PageWithQuadrants_bottomLeft"
              }, {
                html: "<div class=\"bottom right cell\" />",
                ref: "PageWithQuadrants_bottomRight"
              }
            ]
          }
        ]
      }
    ]
  };

  PageWithQuadrants.prototype.topLeft = Control.chain("$PageWithQuadrants_topLeft", "content");

  PageWithQuadrants.prototype.topRight = Control.chain("$PageWithQuadrants_topRight", "content");

  PageWithQuadrants.prototype.bottomLeft = Control.chain("$PageWithQuadrants_bottomLeft", "content");

  PageWithQuadrants.prototype.bottomRight = Control.chain("$PageWithQuadrants_bottomRight", "content");

  PageWithQuadrants.prototype.content = Control.chain("bottomRight");

  return PageWithQuadrants;

})(Page);

/*
A panel arranging items horizontally; items that don't fit overflow into a menu.

The basic strategy is to keep all items on the same line, but make the ones
that don't fit invisible. When the menu button is clicked, the invisible items
are temporarily moved to the menu, then moved back when the menu is closed.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.PanelWithOverflow = (function(_super) {

  __extends(PanelWithOverflow, _super);

  function PanelWithOverflow() {
    PanelWithOverflow.__super__.constructor.apply(this, arguments);
  }

  PanelWithOverflow.prototype.inherited = {
    content: [
      {
        control: "PopupButton",
        ref: "menuButton",
        indicator: "»",
        quiet: "true"
      }, {
        html: "<div/>",
        ref: "PanelWithOverflow_content"
      }
    ],
    generic: "true"
  };

  PanelWithOverflow.prototype.content = Control.chain("$PanelWithOverflow_content", "content", function() {
    return this.checkForSizeChange();
  });

  PanelWithOverflow.prototype.indicator = Control.chain("$menuButton", "indicator", function() {
    return this.checkForSizeChange();
  });

  PanelWithOverflow.prototype.initialize = function() {
    var _this = this;
    this.on("layout sizeChanged", function() {
      return _this.layout();
    });
    return this.$menuButton().on({
      "canceled closed": function() {
        return _this._menuClosed();
      },
      opened: function() {
        _this._menuOpened();
        return _this.$menuButton().positionPopup();
      }
    });
  };

  PanelWithOverflow.prototype.layout = Control.iterator(function() {
    var $child, $children, availableWidth, i, marginLeft, overflowed, right, showMenu, _i, _ref, _ref1;
    if (!this.is(":visible") || this.$menuButton().opened()) {
      return;
    }
    availableWidth = this.width();
    showMenu = false;
    $children = this.$PanelWithOverflow_content().children();
    for (i = _i = _ref = $children.length - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      $child = $children.eq(i);
      marginLeft = (_ref1 = parseInt($child.css("margin-left"))) != null ? _ref1 : 0;
      right = marginLeft + $child.position().left + $child.outerWidth();
      overflowed = right > availableWidth;
      $child.toggleClass("overflowed", overflowed);
      if (overflowed) {
        if (!showMenu) {
          showMenu = true;
          availableWidth -= this.$menuButton().outerWidth(true);
        }
      } else {
        $children.slice(0, i).removeClass("overflowed");
        break;
      }
    }
    this.$menuButton().toggle(showMenu);
    return this;
  });

  PanelWithOverflow.prototype._menuClosed = Control.iterator(function() {
    var $overflowed;
    $overflowed = this.$menuButton().popup();
    this.$PanelWithOverflow_content().append($overflowed);
    return this.layout();
  });

  PanelWithOverflow.prototype._menuOpened = Control.iterator(function() {
    var $overflowed, content;
    content = this.$PanelWithOverflow_content().content();
    $overflowed = $(content).filter(".overflowed");
    this.$menuButton().popup($overflowed);
    return this;
  });

  return PanelWithOverflow;

})(Control);

/*
A panel that can be situated in a vertically scrolling container, and which
will move up and down in the viewport, but will bump up against the top of
the viewport and remain visible instead of scrolling out of view.

The control hosts its content within a panel that can pop out of the layout
flow. To faciliate styling, the control exposes background and padding
properties that map to the corresponding properties on this inner panel.
For most complex content styling, set all content elements within a single
div or other element and style that.

Note: A PersistentPanel should generally be placed within the highest-level
scrolling element on the page; it will not work property when placed
in a scrolling element nested within some outer scrolling element.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.PersistentPanel = (function(_super) {

  __extends(PersistentPanel, _super);

  function PersistentPanel() {
    PersistentPanel.__super__.constructor.apply(this, arguments);
  }

  PersistentPanel.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "PersistentPanel_content"
      }
    ],
    generic: "true"
  };

  PersistentPanel.prototype.background = Control.chain("$PersistentPanel_content", "css/background");

  PersistentPanel.prototype.content = Control.chain("$PersistentPanel_content", "content", function() {
    return this.checkForSizeChange();
  });

  PersistentPanel.prototype.docked = Control.chain("applyClass/docked");

  PersistentPanel.prototype.initialize = function() {
    var _this = this;
    this.on("layout", function() {
      if (_this.inDocument()) {
        return _this._recalc();
      }
    });
    this.inDocument(function() {
      if (!this.scrollingParent()) {
        this.scrollingParent(this._findScrollingParent());
      }
      return this._recalc();
    });
    return $(window).resize(function() {
      return _this._recalc();
    });
  };

  PersistentPanel.prototype.padding = Control.chain("$PersistentPanel_content", "css/padding");

  PersistentPanel.prototype.scrollingParent = Control.property(function(scrollingParent) {
    var _this = this;
    return $(scrollingParent).scroll(function() {
      return _this._recalc();
    });
  });

  PersistentPanel.prototype._adjustSizes = function() {
    this.$PersistentPanel_content().width(this.width());
    return this.height(this.$PersistentPanel_content().outerHeight(true));
  };

  PersistentPanel.prototype._findScrollingParent = function() {
    var overflowY, parent, scrollingParent, _i, _len, _ref;
    scrollingParent = window;
    _ref = this.parents().segments();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      parent = _ref[_i];
      if (parent === document.body) {
        break;
      }
      overflowY = parent.css("overflow-y");
      if (overflowY === "auto" || overflowY === "scroll") {
        scrollingParent = parent;
        break;
      }
    }
    return scrollingParent;
  };

  PersistentPanel.prototype._recalc = function() {
    var $scrollingParent, aboveViewPort, belowViewPort, containerBottom, containerTop, css, dock, isScrollingParentWindow, scrollBottom, scrollTop, scrollingParent, viewPortBottom, viewPortTop;
    scrollingParent = this.scrollingParent();
    if (scrollingParent == null) {
      return;
    }
    isScrollingParentWindow = scrollingParent === window;
    $scrollingParent = $(scrollingParent);
    scrollTop = $scrollingParent.scrollTop();
    containerTop = this.position().top;
    aboveViewPort = containerTop < scrollTop;
    scrollBottom = scrollTop + $scrollingParent.height();
    containerBottom = containerTop + this.height();
    belowViewPort = containerBottom > scrollBottom;
    dock = aboveViewPort || belowViewPort;
    if (dock) {
      this.$PersistentPanel_content().width(this.width());
      this.height(this.$PersistentPanel_content().outerHeight(true));
      css = void 0;
      viewPortTop = isScrollingParentWindow ? 0 : $scrollingParent.offset().top;
      if (aboveViewPort) {
        css = {
          top: viewPortTop + "px"
        };
      } else {
        viewPortBottom = isScrollingParentWindow ? 0 : viewPortTop + $scrollingParent.height();
        css = {
          bottom: viewPortBottom
        };
      }
      this.$PersistentPanel_content().css(css);
    } else {
      this.$PersistentPanel_content().css({
        bottom: "",
        top: "",
        width: ""
      });
      this.css("height", "");
    }
    return this.docked(dock);
  };

  return PersistentPanel;

})(Control);

/*
Base class for popups, menus, dialogs, things that appear temporarily over other
things.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Popup = (function(_super) {

  __extends(Popup, _super);

  function Popup() {
    Popup.__super__.constructor.apply(this, arguments);
  }

  Popup.prototype.inherited = {
    generic: true
  };

  Popup.prototype.cancelOnEscapeKey = Control.property.bool(null, true);

  Popup.prototype.cancelOnOutsideClick = Control.property.bool(null, true);

  Popup.prototype.cancelOnWindowBlur = Control.property.bool(null, true);

  Popup.prototype.cancelOnWindowResize = Control.property.bool(null, true);

  Popup.prototype.cancelOnWindowScroll = Control.property.bool(null, true);

  Popup.prototype.closeOnInsideClick = Control.property.bool(null, true);

  Popup.prototype.cancel = function() {
    return this._close("canceled");
  };

  Popup.prototype.close = function() {
    return this._close("closed");
  };

  Popup.prototype.initialize = function() {
    if (this.overlayClass() === void 0) {
      return this.overlayClass(Overlay);
    }
  };

  Popup.prototype.open = function() {
    var $overlay, overlayClass;
    if (this.opened()) {
      return this;
    }
    overlayClass = this.overlayClass();
    if (overlayClass) {
      $overlay = overlayClass.create().target(this);
      this._overlay($overlay);
    }
    return this._eventsOn().opened(true).trigger("opened").checkForSizeChange().positionPopup();
  };

  Popup.prototype.opened = Control.chain("applyClass/opened");

  Popup.prototype.overlayClass = Control.property["class"]();

  Popup.prototype.positionPopup = function() {};

  Popup.prototype._close = function(closeEventName) {
    if (this._overlay() != null) {
      this._overlay().remove();
      this._overlay(null);
    }
    this._eventsOff();
    if (this.opened()) {
      if (closeEventName) {
        this.trigger(closeEventName);
      }
      this.opened(false);
    }
    return this;
  };

  Popup.prototype._eventsOn = function() {
    var handlerDocumentClick, handlerDocumentKeydown, handlerWindowBlur, handlerWindowResize, handlerWindowScroll,
      _this = this;
    handlerDocumentKeydown = function(event) {
      if (_this.cancelOnEscapeKey() && event.which === 27) {
        _this.cancel();
        return event.stopPropagation();
      }
    };
    handlerDocumentClick = function(event) {
      var outsideClick;
      outsideClick = _this._isElementOutsideControl(event.target);
      if (outsideClick && _this.cancelOnOutsideClick()) {
        return _this.cancel();
      } else if (!outsideClick && _this.closeOnInsideClick()) {
        return _this.close();
      }
    };
    handlerWindowBlur = function(event) {
      if (_this.cancelOnWindowBlur()) {
        return _this.cancel();
      }
    };
    handlerWindowResize = function(event) {
      if (_this.cancelOnWindowResize()) {
        return _this.cancel();
      }
    };
    handlerWindowScroll = function(event) {
      var outsideScroll;
      outsideScroll = _this._isElementOutsideControl(event.target);
      if (outsideScroll && _this.cancelOnWindowScroll()) {
        return _this.cancel();
      }
    };
    $(document).on("keydown", handlerDocumentKeydown);
    $(window).on({
      blur: handlerWindowBlur,
      resize: handlerWindowResize,
      scroll: handlerWindowScroll
    });
    window.setTimeout(function() {
      if (_this.opened()) {
        return $(document).on("click", handlerDocumentClick);
      }
    }, 100);
    return this._handlerDocumentClick(handlerDocumentClick)._handlerDocumentKeydown(handlerDocumentKeydown)._handlerWindowBlur(handlerWindowBlur)._handlerWindowResize(handlerWindowResize)._handlerWindowScroll(handlerWindowScroll);
  };

  Popup.prototype._eventsOff = function() {
    var handlerDocumentClick, handlerDocumentKeydown, handlerWindowBlur, handlerWindowResize, handlerWindowScroll;
    handlerDocumentClick = this._handlerDocumentClick();
    if (handlerDocumentClick) {
      $(document).off("click", handlerDocumentClick);
      this._handlerDocumentClick(null);
    }
    handlerDocumentKeydown = this._handlerDocumentKeydown();
    if (handlerDocumentKeydown) {
      $(document).off("keydown", handlerDocumentKeydown);
      this._handlerDocumentKeydown(null);
    }
    handlerWindowBlur = this._handlerWindowBlur();
    if (handlerWindowBlur) {
      $(window).off("blur", handlerWindowBlur);
      this._handlerWindowBlur(null);
    }
    handlerWindowResize = this._handlerWindowResize();
    if (handlerWindowResize) {
      $(window).off("resize", handlerWindowResize);
      this._handlerWindowResize(null);
    }
    handlerWindowScroll = this._handlerWindowScroll();
    if (handlerWindowScroll) {
      $(window).off("scroll", handlerWindowScroll);
      this._handlerWindowScroll(null);
    }
    return this;
  };

  Popup.prototype._handlerDocumentClick = Control.property();

  Popup.prototype._handlerDocumentKeydown = Control.property();

  Popup.prototype._handlerWindowBlur = Control.property();

  Popup.prototype._handlerWindowResize = Control.property();

  Popup.prototype._handlerWindowScroll = Control.property();

  Popup.prototype._isElementOutsideControl = function(element) {
    var elementInsideControl, elementIsControl;
    elementIsControl = this.index(element) >= 0;
    elementInsideControl = $(element).parents().filter(this).length > 0;
    return !elementIsControl && !elementInsideControl;
  };

  Popup.prototype._overlay = Control.property();

  Popup.prototype._requiredClasses = ["Overlay"];

  return Popup;

})(Control);

/*
A control with a popup.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.PopupSource = (function(_super) {

  __extends(PopupSource, _super);

  function PopupSource() {
    PopupSource.__super__.constructor.apply(this, arguments);
  }

  PopupSource.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "PopupSource_content"
      }, {
        control: "Popup",
        ref: "PopupSource_popup"
      }
    ]
  };

  PopupSource.prototype.cancel = Control.chain("$PopupSource_popup", "cancel");

  PopupSource.prototype.cancelOnEscapeKey = Control.chain("$PopupSource_popup", "cancelOnEscapeKey");

  PopupSource.prototype.cancelOnOutsideClick = Control.chain("$PopupSource_popup", "cancelOnOutsideClick");

  PopupSource.prototype.cancelOnWindowBlur = Control.chain("$PopupSource_popup", "cancelOnWindowBlur");

  PopupSource.prototype.cancelOnWindowResize = Control.chain("$PopupSource_popup", "cancelOnWindowResize");

  PopupSource.prototype.cancelOnWindowScroll = Control.chain("$PopupSource_popup", "cancelOnWindowScroll");

  PopupSource.prototype.close = Control.chain("$PopupSource_popup", "close");

  PopupSource.prototype.closeOnInsideClick = Control.chain("$PopupSource_popup", "closeOnInsideClick");

  PopupSource.prototype.content = Control.chain("$PopupSource_content", "content");

  PopupSource.prototype.contentClass = Control.property["class"](function(contentClass) {
    var $newContent;
    $newContent = this.$PopupSource_content().transmute(contentClass, true, true, true);
    return this.referencedElement("PopupSource_content", $newContent);
  });

  PopupSource.prototype.initialize = function() {
    var _this = this;
    this.$PopupSource_content().click(function(event) {
      if (_this.openOnClick()) {
        return _this.open();
      }
    });
    return this.$PopupSource_popup().on({
      "closed canceled": function() {
        _this.$PopupSource_popup().removeClass("popupAppearsAbove popupAppearsBelow popupAlignLeft popupAlignRight");
        return _this.opened(false);
      },
      opened: function() {
        return _this.positionPopup().opened(true);
      }
    });
  };

  PopupSource.prototype.openOnClick = Control.property.bool(null, true);

  PopupSource.prototype.open = Control.chain("$PopupSource_popup", "open");

  PopupSource.prototype.opened = function(opened) {
    if (opened === void 0) {
      return this.$PopupSource_popup().opened();
    } else {
      return this.applyClass("opened", opened);
    }
  };

  PopupSource.prototype.overlayClass = Control.chain("$PopupSource_popup", "overlayClass");

  PopupSource.prototype.popup = Control.chain("$PopupSource_popup", "content");

  PopupSource.prototype.positionPopup = function() {
    var $popup, bottom, height, left, offset, popupAlignLeft, popupAppearsBelow, popupCss, popupFitsAbove, popupFitsBelow, popupFitsLeftAligned, popupFitsRightAligned, popupHeight, popupWidth, position, right, scrollLeft, scrollTop, top, width, windowHeight, windowWidth;
    offset = this.offset();
    position = this.position();
    top = Math.round(offset.top);
    left = Math.round(offset.left);
    height = this.outerHeight();
    width = this.outerWidth();
    bottom = top + height;
    right = left + width;
    $popup = this.$PopupSource_popup();
    popupHeight = $popup.outerHeight(true);
    popupWidth = $popup.outerWidth(true);
    scrollTop = $(document).scrollTop();
    scrollLeft = $(document).scrollLeft();
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    popupCss = {};
    popupFitsBelow = bottom + popupHeight <= windowHeight + scrollTop;
    popupFitsAbove = top - popupHeight >= scrollTop;
    popupAppearsBelow = popupFitsBelow || !popupFitsAbove;
    popupCss.top = popupAppearsBelow ? "" : position.top - popupHeight;
    popupFitsLeftAligned = left + popupWidth <= windowWidth + scrollLeft;
    popupFitsRightAligned = right - popupWidth >= scrollLeft;
    popupAlignLeft = popupFitsLeftAligned || !popupFitsRightAligned;
    popupCss.left = popupAlignLeft ? "" : position.left + width - popupWidth;
    $popup.toggleClass("popupAppearsAbove", !popupAppearsBelow).toggleClass("popupAppearsBelow", popupAppearsBelow).toggleClass("popupAlignLeft", popupAlignLeft).toggleClass("popupAlignRight", !popupAlignLeft).css(popupCss);
    return this;
  };

  return PopupSource;

})(Control);

/*
A labeled radio button.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.RadioButton = (function(_super) {

  __extends(RadioButton, _super);

  function RadioButton() {
    RadioButton.__super__.constructor.apply(this, arguments);
  }

  RadioButton.prototype.inherited = {
    _type: "radio"
  };

  RadioButton.prototype.autoName = Control.property.bool(null, true, function() {
    return this._checkName();
  });

  RadioButton.prototype.initialize = function() {
    return this.inDocument(function() {
      return this._checkName();
    });
  };

  RadioButton.generateUniqueName = function() {
    return "_group" + this._count++;
  };

  RadioButton.prototype.name = Control.chain("_inputControl", "prop/name", function() {
    return this._checkName();
  });

  RadioButton.prototype._checkName = function() {
    var name, sibling, _i, _len, _ref;
    if (this.inDocument() && this.autoName() && !this.name()) {
      name = void 0;
      _ref = this.siblings().segments();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sibling = _ref[_i];
        if (sibling instanceof RadioButton && sibling.autoName() && sibling.name()) {
          name = sibling.name();
          break;
        }
      }
      if (name == null) {
        name = RadioButton.generateUniqueName();
      }
      return this.name(name);
    }
  };

  RadioButton._count = 0;

  return RadioButton;

})(LabeledInput);

/*
Creates a certain number of instances of another control class.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Repeater = (function(_super) {

  __extends(Repeater, _super);

  function Repeater() {
    Repeater.__super__.constructor.apply(this, arguments);
  }

  Repeater.prototype.content = Control.property(function(content) {
    return this._refreshContent();
  });

  Repeater.prototype.controls = Control.chain("children", "control");

  Repeater.prototype.count = Control.property.integer(function() {
    return this._refresh();
  }, 1);

  Repeater.prototype.initialize = function() {
    if (this.controls() == null) {
      return this._refresh();
    }
  };

  Repeater.prototype.increment = Control.property.bool(function() {
    return this._refreshContent();
  });

  Repeater.prototype.repeatClass = Control.property["class"](function() {
    return this._refresh();
  });

  Repeater.prototype._refresh = function() {
    var controls, count, i, repeatClass;
    repeatClass = this.repeatClass();
    count = this.count();
    if ((repeatClass != null) && count > 0) {
      controls = new Control((function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = count - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push(repeatClass.create());
        }
        return _results;
      })());
      this._refreshContent(controls);
      return (new Control(this)).content(controls);
    }
  };

  Repeater.prototype._refreshContent = function(controls) {
    var content, control, increment, index, instanceContent, _i, _len, _ref, _results;
    controls = controls != null ? controls : this.controls();
    content = this.content();
    increment = this.increment();
    _ref = controls.segments();
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      control = _ref[index];
      instanceContent = content && increment ? content + " " + (index + 1) : content ? content : increment ? index + 1 : void 0;
      if (instanceContent) {
        _results.push(control.content(instanceContent));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  return Repeater;

})(Control);

/*
A device-responsive date picker.
On full browsers, this renders as a date combo box. On mobile browsers, this
renders as a text box that leverages the device's native date picker.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ResponsiveDate = (function(_super) {

  __extends(ResponsiveDate, _super);

  function ResponsiveDate() {
    ResponsiveDate.__super__.constructor.apply(this, arguments);
  }

  ResponsiveDate.prototype.inherited = {
    mobileClass: "MobileDateTextBox",
    defaultClass: "DateComboBox"
  };

  ResponsiveDate.prototype.date = Control.chain("$placeholder", "date");

  ResponsiveDate.prototype._requiredClasses = ["DateComboBox", "MobileDateTextBox"];

  return ResponsiveDate;

})(DeviceSpecific);

/*
An ordered sequence of elements which can be navigated through one at a time.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Sequence = (function(_super) {

  __extends(Sequence, _super);

  function Sequence() {
    Sequence.__super__.constructor.apply(this, arguments);
  }

  Sequence.prototype.inherited = {
    generic: "true"
  };

  Sequence.prototype.activeElement = Control.iterator(function(activeElement) {
    var index;
    if (activeElement === void 0) {
      return this.elements().filter(".active").eq(0).cast(jQuery);
    } else {
      this.elements().not(activeElement).addClass("inactive").removeClass("active");
      index = this.elements().index(activeElement);
      $(activeElement).trigger("active").removeClass("inactive").addClass("active");
      this.trigger("activeElementChanged", [index, activeElement]);
      this.checkForSizeChange();
      return this;
    }
  });

  Sequence.prototype.activeIndex = function(index) {
    if (index === void 0) {
      return this.elements().index(this.activeElement());
    } else {
      return this.activeElement(this.elements().eq(index));
    }
  };

  Sequence.prototype.content = function(content) {
    var container, previousControl, result;
    container = this._container();
    if (content === void 0) {
      if (this[0] === container[0]) {
        return Sequence.__super__.content.call(this, content);
      } else {
        return container.content(content);
      }
    } else {
      previousControl = this.activeElement();
      result = this[0] === container[0] ? Sequence.__super__.content.call(this, content) : container.content(content);
      if ((previousControl != null ? previousControl.parent()[0] : void 0) === this[0]) {
        this.activeElement(previousControl);
      } else {
        this.activeIndex(0);
      }
      return result;
    }
  };

  Sequence.prototype.elements = Control.chain("_container", "children", "cast");

  Sequence.prototype.initialize = function() {
    if (this.elements().length > 0 && this.activeIndex() < 0) {
      return this.activeIndex(0);
    }
  };

  Sequence.prototype.next = Control.iterator(function() {
    var index;
    index = this.activeIndex();
    if (index < this.elements().length - 1) {
      return this.activeIndex(index + 1);
    }
  });

  Sequence.prototype.previous = Control.iterator(function() {
    var index;
    index = this.activeIndex();
    if (index > 0) {
      return this.activeIndex(index - 1);
    }
  });

  Sequence.prototype._container = function() {
    return this;
  };

  return Sequence;

})(Control);

/*
Navigates left and right through its children.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.SequenceNavigator = (function(_super) {

  __extends(SequenceNavigator, _super);

  function SequenceNavigator() {
    SequenceNavigator.__super__.constructor.apply(this, arguments);
  }

  SequenceNavigator.prototype.activeIndex = Control.chain("$LateralNavigator_content", "activeIndex", function(activeIndex) {
    return this._updateButtons();
  });

  SequenceNavigator.prototype.inherited = {
    contentClass: "Modes"
  };

  SequenceNavigator.prototype.canGoNext = function() {
    return this.$LateralNavigator_content().activeIndex() < this.elements().length - 1;
  };

  SequenceNavigator.prototype.canGoPrevious = function() {
    return this.$LateralNavigator_content().activeIndex() > 0;
  };

  SequenceNavigator.prototype.elements = Control.chain("$LateralNavigator_content", "elements");

  SequenceNavigator.prototype.initialize = function() {
    if (this.contentClass() === void 0) {
      return this.contentClass({
        control: Modes,
        maximize: true
      });
    }
  };

  SequenceNavigator.prototype.next = function() {
    return this.$LateralNavigator_content().next();
  };

  SequenceNavigator.prototype.previous = function() {
    return this.$LateralNavigator_content().previous();
  };

  return SequenceNavigator;

})(LateralNavigator);

/*
A polyconstrainHeight ( shim ) supporting the CSS flexible box layout model on newer browsers
and emulating some very basic aspects of that layout model on older browsers.

As of 3/12/12, Mozilla's flexbox support is too flaky to use. Among other
things, if the CSS position is set to absolute, Mozilla will report "display"
as "block" instead of "-moz-box" as expected, which makes it hard to tell
whether flexbox is even supported. Forcing the use of flexbox reveals more
bugs; it's just not worth using at this point.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.SimpleFlexBox = (function(_super) {

  __extends(SimpleFlexBox, _super);

  function SimpleFlexBox() {
    SimpleFlexBox.__super__.constructor.apply(this, arguments);
  }

  SimpleFlexBox.prototype.inherited = {
    content: [
      {
        html: "<div class=\"panel\" />",
        ref: "SimpleFlexBox_panel1"
      }, {
        html: "<div/>",
        ref: "SimpleFlexBox_content"
      }, {
        html: "<div class=\"panel\" />",
        ref: "SimpleFlexBox_panel2"
      }
    ]
  };

  SimpleFlexBox.prototype.content = Control.chain("$SimpleFlexBox_content", "content");

  SimpleFlexBox.prototype.constrainHeight = Control.chain("applyClass/constrainHeight", function() {
    if (!this._checkFlexBox()) {
      return this.trigger("layout");
    }
  });

  SimpleFlexBox.prototype.initialize = function() {
    return this.inDocument(function() {
      return this._checkFlexBox();
    });
  };

  SimpleFlexBox.prototype.orient = Control.property(function(orient) {
    var vertical;
    vertical = this._vertical();
    this.toggleClass("horizontal", !vertical);
    this.toggleClass("vertical", vertical);
    return this._checkFlexBox();
  }, "horizontal");

  SimpleFlexBox.prototype._checkFlexBox = function() {
    var constrainHeight, flexBox, handlingLayout, needLayout,
      _this = this;
    if (!this.inDocument()) {
      return false;
    }
    flexBox = SimpleFlexBox.usingFlexBox(this);
    constrainHeight = this.constrainHeight();
    if (Control.browser.webkit && !this._vertical() && constrainHeight) {
      flexBox = false;
    }
    this._usingFlexBox(flexBox);
    this._childrenCheckSize();
    handlingLayout = this._handlingLayout();
    needLayout = !flexBox && constrainHeight;
    if (needLayout && !handlingLayout) {
      this.on("layout sizeChanged", function() {
        return _this._layout();
      });
      this._handlingLayout(true);
    } else if (!needLayout && handlingLayout) {
      this.off("layout sizeChanged");
      this._handlingLayout(false);
    }
    return flexBox;
  };

  SimpleFlexBox.prototype._layout = function() {
    var css, measureFn, sizePanel1, sizePanel2, vertical;
    vertical = this._vertical();
    measureFn = vertical ? $.prototype.outerHeight : $.prototype.outerWidth;
    sizePanel1 = measureFn.call(this.$SimpleFlexBox_panel1(), true);
    sizePanel2 = measureFn.call(this.$SimpleFlexBox_panel2(), true);
    css = vertical ? {
      bottom: sizePanel2,
      top: sizePanel1
    } : {
      left: sizePanel1,
      right: sizePanel2
    };
    this.$SimpleFlexBox_content().css(css);
    return this._childrenCheckSize();
  };

  SimpleFlexBox.prototype._childrenCheckSize = function() {
    var _ref;
    return (_ref = this.children().children().control()) != null ? _ref.checkForSizeChange() : void 0;
  };

  SimpleFlexBox.prototype._handlingLayout = Control.property.bool(null, false);

  SimpleFlexBox.prototype._panel1 = Control.chain("$SimpleFlexBox_panel1", "content", function() {
    if (!this._usingFlexBox()) {
      return this.$SimpleFlexBox_panel1().checkForSizeChange();
    }
  });

  SimpleFlexBox.prototype._panel2 = Control.chain("$SimpleFlexBox_panel2", "content", function() {
    if (!this._usingFlexBox()) {
      return this.$SimpleFlexBox_panel2().checkForSizeChange();
    }
  });

  SimpleFlexBox.usingFlexBox = function($element) {
    var flexBoxVariants;
    flexBoxVariants = ["box", "-webkit-box"];
    return $.inArray($element.css("display"), flexBoxVariants) >= 0;
  };

  SimpleFlexBox.prototype._usingFlexBox = function(usingFlexBox) {
    if (usingFlexBox === void 0) {
      return !this.hasClass("noFlexBox");
    } else {
      return this.toggleClass("noFlexBox", !usingFlexBox);
    }
  };

  SimpleFlexBox.prototype._vertical = function() {
    return this.orient() === "vertical";
  };

  return SimpleFlexBox;

})(Control);

/*
Display children as elements on a sliding horizontal strip; only one element
is visible at a time. The strip can be programmatically slid left and right.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.SlidingPanels = (function(_super) {

  __extends(SlidingPanels, _super);

  function SlidingPanels() {
    SlidingPanels.__super__.constructor.apply(this, arguments);
  }

  SlidingPanels.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "SlidingPanels_content"
      }
    ]
  };

  SlidingPanels.prototype.activeIndex = function(activeIndex) {
    var left, panel, result;
    result = SlidingPanels.__super__.activeIndex.call(this, activeIndex);
    if (activeIndex !== void 0) {
      panel = this.elements().eq(activeIndex);
      if (panel.length > 0) {
        left = panel.position().left;
        if (SlidingPanels.hasTransitions(this.$SlidingPanels_content())) {
          this.$SlidingPanels_content().css("left", -left);
        } else {
          this.$SlidingPanels_content().animate({
            left: -left
          }, "fast");
        }
      }
    }
    return result;
  };

  SlidingPanels.prototype.content = function(content) {
    var result;
    result = SlidingPanels.__super__.content.call(this, content);
    if (content !== void 0) {
      this._adjustWidths();
    }
    return result;
  };

  SlidingPanels.hasTransitions = function($element) {
    var value;
    if (Control.browser.msie && parseInt(Control.browser.version) < 9) {
      return false;
    }
    value = $element.css("transition-duration");
    return (value != null) && value !== "";
  };

  SlidingPanels.prototype.initialize = function() {
    var _this = this;
    this.inDocument(function() {
      return this._adjustWidths();
    });
    return this.on("layout sizeChanged", function() {
      return _this._adjustWidths();
    });
  };

  SlidingPanels.prototype._adjustWidths = function() {
    var elements, maxPanelOuterWidth, maxPanelWidth, panel, panelOuterWidths, panelWidths;
    elements = this.elements();
    if (elements.length === 0) {
      return;
    }
    panelWidths = (function() {
      var _i, _len, _ref, _results;
      _ref = elements.segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        _results.push(panel.width());
      }
      return _results;
    })();
    maxPanelWidth = Math.max.apply(Math, panelWidths);
    if (maxPanelWidth > 0) {
      elements.width(maxPanelWidth);
    }
    panelOuterWidths = (function() {
      var _i, _len, _ref, _results;
      _ref = elements.segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        _results.push(panel.outerWidth(true));
      }
      return _results;
    })();
    maxPanelOuterWidth = Math.max.apply(Math, panelOuterWidths);
    if (maxPanelOuterWidth > 0) {
      return this.width(maxPanelOuterWidth);
    }
  };

  SlidingPanels.prototype._container = Control.chain("$SlidingPanels_content");

  return SlidingPanels;

})(Sequence);

/*
Show its children as sliding pages which can be navigated by clicking buttons below.
( The conventional button representation is a dot. )
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.SlidingPanelsWithDots = (function(_super) {

  __extends(SlidingPanelsWithDots, _super);

  function SlidingPanelsWithDots() {
    SlidingPanelsWithDots.__super__.constructor.apply(this, arguments);
  }

  SlidingPanelsWithDots.prototype.inherited = {
    content: [
      {
        control: "SlidingPanels",
        ref: "pages"
      }, {
        html: "<div/>",
        ref: "buttonPanel",
        content: [
          {
            control: "Repeater",
            ref: "pageButtons"
          }
        ]
      }
    ],
    generic: "true"
  };

  SlidingPanelsWithDots.prototype.activeIndex = Control.property(function(activeIndex) {
    this.$pages().activeIndex(activeIndex);
    this.pageButtons().removeClass("selected").eq(activeIndex).addClass("selected");
    return this;
  });

  SlidingPanelsWithDots.prototype.content = Control.chain("$pages", "content", function() {
    return this.$pageButtons().count(this.elements().length);
  });

  SlidingPanelsWithDots.prototype.elements = Control.chain("$pages", "elements");

  SlidingPanelsWithDots.prototype.initialize = function() {
    var _this = this;
    if (!this.pageButtonClass()) {
      this.pageButtonClass(BasicButton);
    }
    this.$pageButtons().click(function(event) {
      var index, pageButton;
      pageButton = $(event.target).closest(_this.pageButtons()).control();
      if (pageButton) {
        index = _this.pageButtons().index(pageButton);
        if (index >= 0) {
          return _this.activeIndex(index);
        }
      }
    });
    if (!this.activeIndex()) {
      return this.activeIndex(0);
    }
  };

  SlidingPanelsWithDots.prototype.pageButtons = Control.chain("$pageButtons", "children");

  SlidingPanelsWithDots.prototype.pageButtonClass = Control.chain("$pageButtons", "repeatClass");

  return SlidingPanelsWithDots;

})(Control);

/*
Very basic CSS image sprite.
The images have to be stacked vertically, and all be the same height.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Sprite = (function(_super) {

  __extends(Sprite, _super);

  function Sprite() {
    Sprite.__super__.constructor.apply(this, arguments);
  }

  Sprite.prototype.image = Control.chain("css/background-image");

  Sprite.prototype.cellHeight = Control.property(function(value) {
    this.css("height", value + "px");
    return this._shiftBackground();
  });

  Sprite.prototype.currentCell = Control.property(function(value) {
    return this._shiftBackground();
  }, 0);

  Sprite.prototype._shiftBackground = Control.iterator(function() {
    var backgroundPosition, y;
    if ((this.currentCell() != null) && (this.cellHeight() != null)) {
      y = (this.currentCell() * -this.cellHeight()) + "px";
      if (Control.browser.mozilla) {
        backgroundPosition = this.css("background-position").split(" ");
        backgroundPosition[1] = y;
        return this.css("background-position", backgroundPosition.join(" "));
      } else {
        return this.css("background-position-y", y);
      }
    }
  });

  return Sprite;

})(Control);

/*
A button that uses CSS image sprites for its background.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.SpriteButton = (function(_super) {

  __extends(SpriteButton, _super);

  function SpriteButton() {
    SpriteButton.__super__.constructor.apply(this, arguments);
  }

  SpriteButton.prototype.inherited = {
    content: [
      {
        control: "Sprite",
        ref: "backgroundLeft"
      }, {
        control: "Sprite",
        ref: "backgroundRight"
      }, {
        html: "<div/>",
        ref: "SpriteButton_content"
      }
    ],
    generic: "false"
  };

  SpriteButton.prototype.cellHeight = Control.chain("css/height", function(value) {
    return this._sprites().cellHeight(value);
  });

  SpriteButton.prototype.content = Control.chain("$SpriteButton_content", "content");

  SpriteButton.prototype.image = Control.chain("_sprites", "image");

  SpriteButton.prototype._renderButtonState = function(buttonState) {
    return this._sprites().currentCell(buttonState);
  };

  SpriteButton.prototype._sprites = Control.chain("children", "filter/.Sprite", "cast");

  return SpriteButton;

})(BasicButton);

/*
A control that can be used as a tab in a Tabs.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Tab = (function(_super) {

  __extends(Tab, _super);

  function Tab() {
    Tab.__super__.constructor.apply(this, arguments);
  }

  Tab.prototype.content = function(value) {
    var result;
    result = Tab.__super__.content.call(this, value);
    if (value !== void 0) {
      this.checkForSizeChange();
    }
    return result;
  };

  Tab.prototype.description = Control.property();

  return Tab;

})(Control);

/*
A set of tabbed pages.

Each child of the content will be treated as a page. If the child has a function
called description(), that will be used as the name on the tab.

The Tabs control will resize itself to be as tall as its tallest child.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Tabs = (function(_super) {

  __extends(Tabs, _super);

  function Tabs() {
    Tabs.__super__.constructor.apply(this, arguments);
  }

  Tabs.prototype.inherited = {
    content: [
      {
        control: "VerticalPanels",
        ref: "tabPanels",
        top: [
          {
            control: "List",
            ref: "tabButtons",
            itemClass: "BasicButton"
          }
        ],
        content: [
          {
            control: "Modes",
            ref: "Tabs_content",
            maximize: "true"
          }
        ]
      }
    ],
    generic: "true"
  };

  Tabs.prototype.content = Control.chain("$Tabs_content", "content", function() {
    return this._createButtons();
  });

  Tabs.prototype.contentClass = function(contentClass) {
    var $new;
    if (contentClass === void 0) {
      return this.$Tabs_content().controlClass();
    } else {
      this.$Tabs_content().css({
        height: "",
        width: ""
      });
      $new = this.$Tabs_content().transmute(contentClass, true);
      this.referencedElement("Tabs_content", $new);
      return this;
    }
  };

  Tabs.prototype.fill = Control.chain("$tabPanels", "fill");

  Tabs.prototype.initialize = function() {
    var _this = this;
    this.$tabButtons().click(function(event) {
      var index, tab, tabButton, tabButtonCssClass;
      tabButtonCssClass = "." + _this.tabButtonClass().prototype.className;
      tabButton = $(event.target).closest(tabButtonCssClass).control();
      if (tabButton) {
        index = _this.tabButtons().index(tabButton);
        if (index >= 0) {
          tab = _this.tabs()[index];
          _this.trigger("tabButtonClick", [index, tab]);
          if (_this.selectTabOnClick()) {
            return _this.selectedTabIndex(index);
          }
        }
      }
    });
    this.$Tabs_content().on({
      activeElementChanged: function(event, index, child) {
        var tab;
        tab = $(event.target).filter(_this.tabs());
        if (tab.length > 0) {
          event.stopPropagation();
          return _this.trigger("activeTabChanged", [index, child]);
        }
      }
    });
    if (this.tabs().length > 0 && !this.selectedTabIndex()) {
      return this.selectedTabIndex(0);
    }
  };

  Tabs.prototype.selectTabOnClick = Control.property.bool(null, true);

  Tabs.prototype.selectedTab = Control.chain("$Tabs_content", "activeElement");

  Tabs.prototype.selectedTabIndex = Control.chain("$Tabs_content", "activeIndex", function(index) {
    return this.tabButtons().removeClass("selected").eq(index).addClass("selected");
  });

  Tabs.prototype.tabButtons = Control.chain("$tabButtons", "children");

  Tabs.prototype.tabButtonClass = Control.chain("$tabButtons", "itemClass", function() {
    return this._createButtons();
  });

  Tabs.prototype.tabs = Control.chain("$Tabs_content", "elements");

  Tabs.prototype._createButtons = function() {
    var descriptions, selectedTabIndex, tab;
    if (this.tabButtonClass() === void 0) {
      return;
    }
    descriptions = (function() {
      var _i, _len, _ref, _results;
      _ref = this.tabs().segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tab = _ref[_i];
        if ((tab != null) && $.isFunction(tab.description)) {
          _results.push(tab.description());
        } else {
          _results.push("");
        }
      }
      return _results;
    }).call(this);
    this.$tabButtons().items(descriptions);
    selectedTabIndex = this.selectedTabIndex();
    if (selectedTabIndex != null) {
      return this.selectedTabIndex(selectedTabIndex);
    }
  };

  return Tabs;

})(Control);

/*
Formats its content as an XML tag.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Tag = (function(_super) {

  __extends(Tag, _super);

  function Tag() {
    Tag.__super__.constructor.apply(this, arguments);
  }

  Tag.prototype.inherited = {
    content: [
      "&lt;", {
        html: "<span/>",
        ref: "Tag_content"
      }, ">"
    ]
  };

  Tag.prototype.tag = "span";

  Tag.prototype.content = Control.chain("$Tag_content", "content");

  return Tag;

})(Control);

/*
General purpose base class for text box controls.
This simply wraps a normal input element.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.TextBox = (function(_super) {

  __extends(TextBox, _super);

  function TextBox() {
    TextBox.__super__.constructor.apply(this, arguments);
  }

  TextBox.prototype.tag = "input";

  TextBox.prototype.content = function(content) {
    var result;
    result = TextBox.__super__.content.call(this, content);
    if (content !== void 0) {
      this.trigger("change");
    }
    return result;
  };

  TextBox.prototype.disabled = Control.chain("prop/disabled");

  TextBox.prototype.initialize = function() {
    if (this.type() === "text") {
      return this.type("text");
    }
  };

  TextBox.prototype.placeholder = Control.chain("prop/placeholder");

  TextBox.prototype.spellcheck = Control.chain("prop/spellcheck");

  TextBox.prototype.type = Control.chain("prop/type");

  return TextBox;

})(Control);

/*
Control with a content area (usually some form of text box) and an associated "Go" button
(labeled something like "Search"), where clicking the button does something with the content.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.TextBoxWithButton = (function(_super) {

  __extends(TextBoxWithButton, _super);

  function TextBoxWithButton() {
    TextBoxWithButton.__super__.constructor.apply(this, arguments);
  }

  TextBoxWithButton.prototype.inherited = {
    content: {
      control: "HorizontalPanels",
      content: {
        control: "TextBox",
        ref: "TextBoxWithButton_textBox"
      },
      right: {
        control: "BasicButton",
        ref: "TextBoxWithButton_goButton",
        content: "Go"
      }
    },
    generic: true
  };

  TextBoxWithButton.prototype.content = function(value) {
    var result;
    result = this.$TextBoxWithButton_textBox().content(value);
    if (value !== void 0) {
      this._disableGoButtonIfContentEmpty();
    }
    return result;
  };

  TextBoxWithButton.prototype.goButton = Control.chain("$TextBoxWithButton_goButton", "control");

  TextBoxWithButton.prototype.goButtonContent = Control.chain("goButton", "content");

  TextBoxWithButton.prototype.initialize = function() {
    var _this = this;
    this.$TextBoxWithButton_textBox().on("change keydown keyup", function(event) {
      var keyCode;
      _this._disableGoButtonIfContentEmpty();
      keyCode = event.keyCode || event.which;
      if (!_this._isContentEmpty() && keyCode === 13) {
        _this.trigger("goButtonClick");
        return false;
      }
    });
    this.$TextBoxWithButton_goButton().click(function() {
      return _this.trigger("goButtonClick");
    });
    return this._disableGoButtonIfContentEmpty();
  };

  TextBoxWithButton.prototype.placeholder = Control.chain("textBox", "prop/placeholder");

  TextBoxWithButton.prototype.spellcheck = Control.chain("textBox", "prop/spellcheck");

  TextBoxWithButton.prototype.textBox = Control.chain("$TextBoxWithButton_textBox", "control");

  TextBoxWithButton.prototype._disableGoButtonIfContentEmpty = function() {
    var content, goButton;
    content = this.content();
    goButton = this.goButton();
    if ((goButton != null) && goButton instanceof BasicButton) {
      return goButton.disabled(this._isContentEmpty());
    }
  };

  TextBoxWithButton.prototype._isContentEmpty = function() {
    var content;
    content = this.content();
    return (content == null) || content.length === 0;
  };

  return TextBoxWithButton;

})(Control);

/*
Shows text in a condensed font if necessary to squeeze in more text.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.TextCondenser = (function(_super) {

  __extends(TextCondenser, _super);

  function TextCondenser() {
    TextCondenser.__super__.constructor.apply(this, arguments);
  }

  TextCondenser.prototype.inherited = {
    content: [
      {
        html: "<span/>",
        ref: "normal"
      }, {
        html: "<span/>",
        ref: "condensed"
      }
    ]
  };

  TextCondenser.prototype.condensedFontFamily = Control.chain("$condensed", "css/font-family");

  TextCondenser.prototype.content = Control.chain("$normal", "content", function(content) {
    this.$condensed().content(content);
    return this.checkForSizeChange();
  });

  TextCondenser.prototype.initialize = function() {
    var _this = this;
    return this.on("layout sizeChanged", function() {
      return _this.layout();
    });
  };

  TextCondenser.prototype.layout = Control.iterator(function() {
    var tooWide;
    tooWide = this.$normal().width() > this.width();
    return this.applyClass("condensed", tooWide);
  });

  return TextCondenser;

})(Control);

/*
A button which can hold a selected state.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ToggleButton = (function(_super) {

  __extends(ToggleButton, _super);

  function ToggleButton() {
    ToggleButton.__super__.constructor.apply(this, arguments);
  }

  ToggleButton.prototype.initialize = function() {
    var _this = this;
    return this.click(function() {
      if (!_this.disabled()) {
        return _this.toggleSelected();
      }
    });
  };

  ToggleButton.prototype.selected = Control.chain("applyClass/selected");

  ToggleButton.prototype.toggleSelected = function(value) {
    return this.selected(value != null ? value : !this.selected());
  };

  return ToggleButton;

})(BasicButton);

/*
A message which briefly appears on a page before automatically disappearing.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.TransientMessage = (function(_super) {

  __extends(TransientMessage, _super);

  function TransientMessage() {
    TransientMessage.__super__.constructor.apply(this, arguments);
  }

  TransientMessage.prototype.inherited = {
    generic: "true"
  };

  TransientMessage.prototype.close = function() {
    var _this = this;
    this.fadeOut(null, function() {
      return _this._close();
    });
    return this;
  };

  TransientMessage.prototype.duration = Control.property();

  TransientMessage.prototype.initialize = function() {
    var _this = this;
    return this.click(function() {
      return _this._close();
    });
  };

  TransientMessage.prototype.open = function() {
    var content, duration, length, timeout,
      _this = this;
    duration = this.duration();
    if (!duration) {
      content = this.content();
      length = typeof content === "string" ? content.length : $(content).text().length;
      duration = 750 + (length * 20);
    }
    if (duration >= 0) {
      timeout = setTimeout(function() {
        return _this.close();
      }, duration);
      this._timeout(timeout);
    }
    this.positionMessage().fadeIn();
    return this;
  };

  TransientMessage.prototype.positionMessage = function() {
    return this.css({
      left: ($(window).width() - this.outerWidth()) / 2
    });
  };

  TransientMessage.showMessage = function(content, duration) {
    var transientMessage;
    transientMessage = TransientMessage.create();
    if (content) {
      transientMessage.content(content);
    }
    if (duration) {
      transientMessage.duration(duration);
    }
    $(document.body).append(transientMessage);
    transientMessage.open();
    return transientMessage;
  };

  TransientMessage.prototype._close = function() {
    var timeout;
    timeout = this._timeout();
    if (timeout) {
      clearTimeout(timeout);
      this._timeout(null);
    }
    return this.remove();
  };

  TransientMessage.prototype._timeout = Control.property();

  return TransientMessage;

})(Control);

/*
Validates textual input using an asymmetric validation scheme.
This applies a validation function while the user is typing, when the
control loses focus, or when a validate() method is called.

The validation is considered asymmetric because the control behaves differently
in an error state than when not in an error state:
1. If the control is not yet in an error state, the control's validity is not
reflected until the focus leaves the control. That is, the input is assumed
to be good until the user has moved on.
2. If the control is already in an error state, the control's validity is
reflected immediately upon detecting valid input. That is, the error is
forgiven without requiring that the user moves the focus away.

For more discussion: http://miksovsky.blogs.com/flowstate/2010/09/index.html.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ValidatingTextBox = (function(_super) {

  __extends(ValidatingTextBox, _super);

  function ValidatingTextBox() {
    ValidatingTextBox.__super__.constructor.apply(this, arguments);
  }

  ValidatingTextBox.prototype.inherited = {
    generic: "true"
  };

  ValidatingTextBox.prototype.content = function(content) {
    var result;
    result = ValidatingTextBox.__super__.content.call(this, content);
    if (content !== void 0 && this.validateOnSet()) {
      this.validate(true);
    }
    return result;
  };

  ValidatingTextBox.prototype.initialize = function() {
    var _this = this;
    return this.on({
      blur: function() {
        if (_this.validateOnBlur()) {
          return _this.validate(true);
        }
      },
      keyup: function() {
        return _this.validate();
      }
    });
  };

  ValidatingTextBox.prototype.invalid = Control.chain("applyClass/invalid");

  ValidatingTextBox.prototype.required = Control.property.bool();

  ValidatingTextBox.prototype.valid = function() {
    var _ref;
    if (this.required()) {
      return ((_ref = this.content()) != null ? _ref.length : void 0) > 0;
    } else {
      return true;
    }
  };

  ValidatingTextBox.prototype.validate = Control.iterator(function(strict) {
    var valid;
    valid = this.valid();
    if (strict || this.invalid()) {
      this.invalid(!valid);
    }
    return this;
  });

  ValidatingTextBox.prototype.validateOnBlur = Control.property.bool(null, true);

  ValidatingTextBox.prototype.validateOnSet = Control.property.bool(null, true);

  return ValidatingTextBox;

})(TextBox);

/*
Vertically align children using CSS flexbox layout if available, and manual
layout if not.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.VerticalAlign = (function(_super) {

  __extends(VerticalAlign, _super);

  function VerticalAlign() {
    VerticalAlign.__super__.constructor.apply(this, arguments);
  }

  VerticalAlign.prototype.initialize = function() {
    return this.inDocument(function() {
      return this._checkFlexBox();
    });
  };

  VerticalAlign.prototype._checkFlexBox = function() {
    var flexBox, handlingLayout, needLayout,
      _this = this;
    if (!this.inDocument()) {
      return false;
    }
    flexBox = SimpleFlexBox.usingFlexBox(this);
    this._usingFlexBox(flexBox);
    handlingLayout = this._handlingLayout();
    needLayout = !flexBox;
    if (needLayout && !handlingLayout) {
      this.on("layout sizeChanged", function() {
        return _this._layout();
      });
      this._handlingLayout(true);
    } else if (!needLayout && handlingLayout) {
      this.off("layout sizeChanged");
      this._handlingLayout(false);
    }
    return flexBox;
  };

  VerticalAlign.prototype._handlingLayout = Control.property.bool(null, false);

  VerticalAlign.prototype._layout = function() {
    var availableSpace, child, childrenHeight, paddingTop, _i, _len, _ref;
    this.css("padding-top", "");
    childrenHeight = 0;
    _ref = this.children();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      childrenHeight += $(child).outerHeight();
    }
    availableSpace = Math.max(this.height() - childrenHeight, 0);
    paddingTop = availableSpace / 2;
    if (paddingTop > 0) {
      return this.css("padding-top", paddingTop);
    }
  };

  VerticalAlign.prototype._usingFlexBox = function(usingFlexBox) {
    if (usingFlexBox === void 0) {
      return !this.hasClass("noFlexBox");
    } else {
      return this.toggleClass("noFlexBox", !usingFlexBox);
    }
  };

  return VerticalAlign;

})(Control);

/*
Position a top and/or bottom panel above or below a main content panel.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.VerticalPanels = (function(_super) {

  __extends(VerticalPanels, _super);

  function VerticalPanels() {
    VerticalPanels.__super__.constructor.apply(this, arguments);
  }

  VerticalPanels.prototype.inherited = {
    orient: "vertical"
  };

  VerticalPanels.prototype.bottom = Control.chain("_panel2");

  VerticalPanels.prototype.top = Control.chain("_panel1");

  return VerticalPanels;

})(SimpleFlexBox);

/*
This version class exists so we can work a version number into the catalog.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window._Version = (function(_super) {

  __extends(_Version, _super);

  function _Version() {
    _Version.__super__.constructor.apply(this, arguments);
  }

  _Version.catalog = "0.9.4.0";

  return _Version;

})(Control);

/*
Navigates through its children with a sliding transition.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Carousel = (function(_super) {

  __extends(Carousel, _super);

  function Carousel() {
    Carousel.__super__.constructor.apply(this, arguments);
  }

  Carousel.prototype.inherited = {
    contentClass: "SlidingPanels"
  };

  return Carousel;

})(SequenceNavigator);

/*
A labeled check box.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.CheckBox = (function(_super) {

  __extends(CheckBox, _super);

  function CheckBox() {
    CheckBox.__super__.constructor.apply(this, arguments);
  }

  CheckBox.prototype.inherited = {
    _type: "checkbox"
  };

  return CheckBox;

})(LabeledInput);

/*
An input area with a dropdown arrow, which invokes a popup.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ComboBox = (function(_super) {

  __extends(ComboBox, _super);

  function ComboBox() {
    ComboBox.__super__.constructor.apply(this, arguments);
  }

  ComboBox.prototype.inherited = {
    content: [
      {
        html: "<div/>",
        ref: "ComboBox_content"
      }, {
        control: "ToggleButton",
        ref: "dropdownButton",
        "class": "quiet",
        tabindex: "-1",
        content: "▼"
      }
    ],
    closeOnInsideClick: "false",
    generic: "true",
    openOnClick: "false"
  };

  ComboBox.prototype.closeOnEnter = Control.property.bool(null, true);

  ComboBox.prototype.content = Control.chain("$ComboBox_content", "content");

  ComboBox.prototype.dropdownButtonContent = Control.chain("$dropdownButton", "content");

  ComboBox.prototype.initialize = function() {
    var _this = this;
    this.$PopupSource_popup().on({
      canceled: function() {
        return _this.$dropdownButton().selected(false);
      },
      closed: function() {
        var content;
        if (!Control.browser.msie) {
          content = _this.content();
          _this.inputElement().focus();
          _this._selectText(0, content.length);
        }
        return _this.$dropdownButton().selected(false);
      }
    });
    this.on({
      focusout: function(event) {
        if (_this.opened()) {
          return setTimeout(function() {
            var focusInControl;
            focusInControl = $.contains(_this[0], document.activeElement);
            if (!focusInControl && _this.opened()) {
              return _this.cancel();
            }
          }, 1);
        }
      }
    });
    this.$dropdownButton().click(function(event) {
      return _this.open();
    });
    this.$PopupSource_popup().prop("tabindex", -1);
    if (!this.textBoxClass()) {
      return this.textBoxClass(TextBox);
    }
  };

  ComboBox.prototype.inputElement = function() {
    var $content;
    $content = this.$ComboBox_content();
    if ($content[0].nodeName.toLowerCase() === "input" && $content.prop("type") === "text") {
      return $content;
    }
    return this.$ComboBox_content().find("input[ type='text' ]").eq(0);
  };

  ComboBox.prototype.open = function() {
    var control, width, _i, _len, _ref;
    if (!this.opened()) {
      if (this.hasClass("generic")) {
        _ref = this.segments();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          control = _ref[_i];
          width = control.outerWidth();
          control.$PopupSource_popup().css("min-width", width + "px");
        }
      }
      this.$dropdownButton().selected(true);
    }
    return ComboBox.__super__.open.call(this);
  };

  ComboBox.prototype.openOnFocus = Control.property.bool(null, true);

  ComboBox.prototype.textBox = Control.chain("$ComboBox_content", "control");

  ComboBox.prototype.textBoxClass = Control.property["class"](function(textBoxClass) {
    var $textBox;
    $textBox = this.$ComboBox_content().transmute(textBoxClass, true);
    this.referencedElement("ComboBox_content", $textBox);
    return this._bindContentEvents();
  });

  ComboBox.prototype._bindContentEvents = function() {
    var _this = this;
    return this.$ComboBox_content().on({
      "click focusin": function(event) {
        if (_this.openOnFocus() && !_this.opened()) {
          return _this.open();
        }
      },
      keydown: function(event) {
        var opened;
        opened = _this.opened();
        if (event.which === 13 && opened && _this.closeOnEnter()) {
          return _this.close();
        } else if (event.which === 9 && opened) {
          return _this.close();
        }
      }
    });
  };

  ComboBox.prototype._requiredClasses = ["TextBox"];

  ComboBox.prototype._selectText = function(start, end) {
    var inputElement, range;
    inputElement = this.inputElement()[0];
    if (inputElement == null) {
      return;
    }
    if (inputElement.setSelectionRange) {
      return inputElement.setSelectionRange(start, end);
    } else if (inputElement.createTextRange) {
      range = inputElement.createTextRange();
      range.moveStart("character", start);
      range.moveEnd("character", end);
      return range.select();
    }
  };

  return ComboBox;

})(PopupSource);

/*
Lets user pick a date with a date-optimzed text box or a navigable month calendar.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.DateComboBox = (function(_super) {

  __extends(DateComboBox, _super);

  function DateComboBox() {
    DateComboBox.__super__.constructor.apply(this, arguments);
  }

  DateComboBox.prototype.inherited = {
    textBoxClass: "DateTextBox",
    popup: [
      {
        control: "CalendarMonthNavigator",
        ref: "navigator"
      }
    ]
  };

  DateComboBox.prototype.culture = function(culture) {
    var result;
    result = DateComboBox.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this.$navigator().culture(culture);
      if ($.isFunction(this.textBox().culture)) {
        this.textBox().culture(culture);
      }
    }
    return result;
  };

  DateComboBox.prototype.date = Control.property.date(function(date) {
    var navigatorDate, textBoxDate, time;
    time = date && date.getTime();
    textBoxDate = this.$ComboBox_content().date();
    if (!textBoxDate || textBoxDate.getTime() !== time) {
      this.$ComboBox_content().date(date);
    }
    if (date != null) {
      navigatorDate = this.$navigator().date();
      if (!navigatorDate || navigatorDate.getTime() !== time) {
        return this.$navigator().date(date);
      }
    }
  });

  DateComboBox.prototype.initialize = function() {
    var _this = this;
    this.date(this.$navigator().date());
    return this.on({
      dateChanged: function(event, date) {
        return _this.date(date);
      },
      dateSelected: function(event, date) {
        _this.date(date);
        return _this.close();
      }
    });
  };

  DateComboBox.prototype.navigatorClass = Control.chain("$navigator", "transmute");

  DateComboBox.prototype.required = Control.chain("$ComboBox_content", "required");

  DateComboBox.prototype._requiredClasses = ["DateTextBox"];

  return DateComboBox;

})(ComboBox);

/*
Text box that parses dates.

If Globalize is installed, all of the current culture's local date formats are
supported, plus modified short date formats that permit a missing year or two-
digit year. If Globalize is not installed, a default date parser is used.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.DateTextBox = (function(_super) {

  __extends(DateTextBox, _super);

  function DateTextBox() {
    DateTextBox.__super__.constructor.apply(this, arguments);
  }

  DateTextBox.prototype.culture = function(culture) {
    var result;
    result = DateTextBox.__super__.culture.call(this, culture);
    if (culture !== void 0) {
      this._updateDatePatterns();
      this._refresh();
    }
    return result;
  };

  DateTextBox.prototype.date = Control.property.date(function(date) {
    var dateChanged, hasFocus, previousDate, previousTime, time;
    previousDate = this._previousDate();
    previousTime = previousDate && previousDate.getTime();
    time = date && date.getTime();
    dateChanged = previousTime !== time;
    if (dateChanged) {
      hasFocus = this[0] === document.activeElement;
      if (!hasFocus) {
        this._refresh();
      }
      return this._previousDate(date).trigger("dateChanged", [date]);
    }
  });

  DateTextBox.prototype.initialize = function() {
    var _this = this;
    this.blur(function() {
      return _this._refresh();
    });
    return this._updateDatePatterns();
  };

  DateTextBox.prototype.valid = function() {
    var content, date, valid;
    valid = DateTextBox.__super__.valid.call(this);
    content = this.content();
    date = this._parseDate(content);
    this.date(date);
    if ((content != null ? content.length : void 0) > 0) {
      valid = valid && (date != null);
    }
    return valid;
  };

  DateTextBox.prototype._abbreviatedDatePatterns = function(culture) {
    var calendar, fullYearPlaceholder, patterns, separator, separatorThenYear, shortPattern, yearThenSeparator;
    patterns = [];
    calendar = culture.calendar;
    shortPattern = calendar.patterns.d;
    fullYearPlaceholder = "yyyy";
    if (shortPattern.indexOf(fullYearPlaceholder)) {
      patterns.push(shortPattern.replace(fullYearPlaceholder, "yy"));
    }
    separator = calendar["/"];
    separatorThenYear = separator + fullYearPlaceholder;
    yearThenSeparator = fullYearPlaceholder + separator;
    if (shortPattern.indexOf(separatorThenYear) >= 0) {
      patterns.push(shortPattern.replace(separatorThenYear, ""));
    } else if (shortPattern.indexOf(yearThenSeparator) >= 0) {
      patterns.push(shortPattern.replace(yearThenSeparator, ""));
    }
    return patterns;
  };

  DateTextBox.prototype._datePatterns = Control.property();

  DateTextBox.prototype._dateSeparator = function() {
    var calendar, _ref, _ref1;
    calendar = (_ref = (_ref1 = this.culture()) != null ? _ref1.calendar : void 0) != null ? _ref : DateTextBox;
    return calendar["/"];
  };

  DateTextBox.prototype._formatDate = function(date) {
    var culture;
    culture = this.culture();
    if (culture) {
      return Globalize.format(date, culture.calendar.patterns.d, culture);
    } else {
      return (date.getMonth() + 1) + this._dateSeparator() + date.getDate() + this._dateSeparator() + date.getFullYear();
    }
  };

  DateTextBox.prototype._parseDate = function(text) {
    if (this.culture()) {
      return Globalize.parseDate(text, this._datePatterns(), this.culture());
    } else {
      return this._parseDateDefault(text);
    }
  };

  DateTextBox.prototype._parseDateDefault = function(text) {
    var currentYear, dateSeparator, fullYear, milliseconds, munged, parts;
    if (text === "") {
      return null;
    }
    dateSeparator = this._dateSeparator();
    parts = text.split(dateSeparator);
    currentYear = (new Date()).getFullYear().toString();
    munged = parts.length === 2 ? text + dateSeparator + currentYear : parts.length === 3 && parts[2].length === 2 ? (fullYear = currentYear.substring(0, 2) + parts[2], parts[0] + dateSeparator + parts[1] + dateSeparator + fullYear) : text;
    milliseconds = Date.parse(munged);
    if (isNaN(milliseconds)) {
      return null;
    } else {
      return new Date(milliseconds);
    }
  };

  DateTextBox.prototype._refresh = function() {
    var date, formattedDate;
    date = this.date();
    if (date != null) {
      formattedDate = this._formatDate(date);
      if (this.content() !== formattedDate) {
        this.content(formattedDate);
      }
    }
    return this;
  };

  DateTextBox.prototype._previousDate = Control.property.date();

  DateTextBox.prototype._updateDatePatterns = function() {
    var abbreviatedDatePatterns, culture, datePatterns, name, pattern;
    datePatterns = null;
    culture = this.culture();
    if (culture) {
      abbreviatedDatePatterns = this._abbreviatedDatePatterns(culture);
      if (abbreviatedDatePatterns.length > 0) {
        datePatterns = (function() {
          var _ref, _results;
          _ref = culture.calendar.patterns;
          _results = [];
          for (name in _ref) {
            pattern = _ref[name];
            _results.push(pattern);
          }
          return _results;
        })();
        datePatterns = datePatterns.concat(abbreviatedDatePatterns);
      }
    }
    return this._datePatterns(datePatterns);
  };

  return DateTextBox;

})(ValidatingTextBox);

DateTextBox["/"] = "/";

/*
Base class for modal dialogs.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Dialog = (function(_super) {

  __extends(Dialog, _super);

  function Dialog() {
    Dialog.__super__.constructor.apply(this, arguments);
  }

  Dialog.prototype.inherited = {
    cancelOnOutsideClick: "false",
    cancelOnWindowBlur: "false",
    cancelOnWindowResize: "false",
    cancelOnWindowScroll: "false",
    closeOnInsideClick: "false",
    overlayClass: "ModalOverlay"
  };

  Dialog.prototype.cancel = function() {
    return Dialog.__super__.cancel.apply(this, arguments).remove();
  };

  Dialog.prototype.close = function() {
    return Dialog.__super__.close.apply(this, arguments).remove();
  };

  Dialog.prototype.initialize = function() {
    var _this = this;
    return this.on("layout sizeChanged", function() {
      return _this.positionPopup();
    });
  };

  Dialog.prototype.positionPopup = function() {
    var $window;
    $window = $(window);
    return this.css({
      left: ($window.width() - this.outerWidth()) / 2,
      top: ($window.height() - this.outerHeight()) / 2
    });
  };

  Dialog.showDialog = function(dialogClass, properties, callbackOk, callbackCancel) {
    var dialog, maximumZIndex,
      _this = this;
    dialog = dialogClass.create(properties);
    dialog.on({
      closed: function() {
        if (callbackOk != null) {
          return callbackOk.call($(_this).control());
        }
      },
      canceled: function() {
        if (callbackCancel != null) {
          return callbackCancel.call($(_this).control());
        }
      }
    });
    maximumZIndex = Dialog._maximumZIndex();
    if (maximumZIndex) {
      dialog.css("z-index", maximumZIndex + 1);
    }
    $(document.body).append(dialog);
    dialog.open();
    return dialog;
  };

  Dialog._maximumZIndex = function() {
    var zIndices;
    zIndices = $("*").map(function(index, element) {
      var $element, zIndex;
      $element = $(element);
      if ($element.css("position") !== "static") {
        zIndex = parseInt($element.css("z-index"));
        if (zIndex) {
          return zIndex;
        }
      }
    });
    zIndices = zIndices.get();
    if (zIndices.length > 0) {
      return Math.max.apply(Math, zIndices);
    } else {
      return null;
    }
  };

  return Dialog;

})(Popup);

/*
Position a left and/or right panel on the sides of a main content panel.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.HorizontalPanels = (function(_super) {

  __extends(HorizontalPanels, _super);

  function HorizontalPanels() {
    HorizontalPanels.__super__.constructor.apply(this, arguments);
  }

  HorizontalPanels.prototype.inherited = {
    orient: "horizontal"
  };

  HorizontalPanels.prototype.left = Control.chain("_panel1");

  HorizontalPanels.prototype.leftClass = Control.property["class"](function(leftClass) {
    var $new;
    $new = this.$SimpleFlexBox_panel1().transmute(leftClass, true);
    $new.addClass("panel");
    return this.referencedElement("SimpleFlexBox_panel1", $new);
  });

  HorizontalPanels.prototype.right = Control.chain("_panel2");

  HorizontalPanels.prototype.rightClass = Control.property["class"](function(right) {
    var $new;
    $new = this.$SimpleFlexBox_panel2().transmute(right, true);
    $new.addClass("panel");
    return this.referencedElement("SimpleFlexBox_panel2", $new);
  });

  return HorizontalPanels;

})(SimpleFlexBox);

/*
Renders a list of items in a combo box.

The user can type arbitrary text; if they type the beginning of a list item's
content, the remainder of the item's content is AutoCompleted. For this to
work, both the control's content and the content of the list items should
be strings.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ListComboBox = (function(_super) {

  __extends(ListComboBox, _super);

  function ListComboBox() {
    ListComboBox.__super__.constructor.apply(this, arguments);
  }

  ListComboBox.prototype.inherited = {
    popup: [
      {
        control: "ListBox",
        ref: "list"
      }
    ]
  };

  ListComboBox.prototype.items = Control.chain("$list", "items", function() {
    return this._updateItemContents();
  });

  ListComboBox.prototype.mapFunction = Control.chain("$list", "mapFunction");

  ListComboBox.prototype.initialize = function() {
    var _this = this;
    return this.$list().on({
      click: function(event) {
        var $closestItem, itemContent;
        $closestItem = $(event.target).closest(_this.$list().children());
        if ($closestItem) {
          itemContent = $closestItem.control().content();
          return _this.content(itemContent).close();
        }
      },
      keydown: function(event) {
        if (event.which === 13) {
          if (_this.opened()) {
            _this.close();
            event.stopPropagation();
            return event.preventDefault();
          }
        }
      },
      selectionChanged: function() {
        var content, selectedControl;
        selectedControl = _this.$list().selectedControl();
        if (selectedControl) {
          content = selectedControl.content();
          if (content !== _this.content()) {
            _this.content(content);
            return _this._selectText(0, content.length);
          }
        }
      }
    });
  };

  ListComboBox.prototype.itemClass = Control.property["class"](function(itemClass) {
    return this.$list().itemClass(itemClass);
  });

  ListComboBox.prototype.open = function() {
    var content, index, inputElement, result;
    content = this.content();
    index = $.inArray(content, this._itemContents());
    if (index >= 0) {
      this.$list().selectedIndex(index);
    }
    result = ListComboBox.__super__.open.call(this);
    inputElement = this.inputElement();
    if (document.activeElement !== inputElement[0]) {
      inputElement.focus();
    }
    return result;
  };

  ListComboBox.prototype._autoComplete = function() {
    var content, match;
    content = this.content();
    match = this._matchingItem(content);
    if (!match) {
      this.$list().selectedControl(null);
      return;
    }
    this.content(match);
    this._selectText(content.length, match.length);
    return this._selectTextInList();
  };

  ListComboBox.prototype._bindContentEvents = function() {
    var _this = this;
    ListComboBox.__super__._bindContentEvents.call(this);
    return this.inputElement().keydown(function(event) {
      return _this._contentKeydown(event);
    });
  };

  ListComboBox.prototype._contentKeydown = function(event) {
    var content, handled, navigationKeys,
      _this = this;
    handled = false;
    navigationKeys = [33, 34, 38, 40];
    if ((event.which === 32 || event.which >= 48) && !(event.altKey || event.ctrlKey || event.metaKey)) {
      this._setTimeout(function() {
        return _this._autoComplete();
      });
    } else if (this.opened() && $.inArray(event.which, navigationKeys) >= 0) {
      this.$list().trigger(event);
      handled = true;
    } else if (event.which === 8 || event.which === 46) {
      this._setTimeout(function() {
        return _this._selectTextInList();
      });
    } else if (event.which === 40) {
      this.open();
      content = this.content();
      if ((content == null) || content.length === 0) {
        this.$list().selectedIndex(0);
      }
      handled = true;
    }
    if (handled) {
      event.stopPropagation();
      return event.preventDefault();
    }
  };

  ListComboBox.prototype._itemContents = Control.property();

  ListComboBox.prototype._matchingItem = function(s) {
    var itemContent, length, lower, _i, _len, _ref;
    length = s.length;
    if (length > 0) {
      lower = s.toLowerCase();
      _ref = this._itemContents();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        itemContent = _ref[_i];
        if (length <= itemContent.length && itemContent.substr(0, length).toLowerCase() === lower) {
          return itemContent;
        }
      }
    }
    return null;
  };

  ListComboBox.prototype._selectTextInList = function() {
    var content, index;
    if (this.opened()) {
      content = this.content();
      index = $.inArray(content, this._itemContents());
      return this.$list().selectedIndex(index);
    }
  };

  ListComboBox.prototype._setTimeout = function(callback) {
    var timeout;
    timeout = this._timeout();
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(callback, 50);
    return this._timeout(timeout);
  };

  ListComboBox.prototype._timeout = Control.property();

  ListComboBox.prototype._updateItemContents = function() {
    var control, controls, itemContents;
    controls = this.$list().controls();
    itemContents = (function() {
      var _i, _len, _ref, _results;
      _ref = controls.segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        control = _ref[_i];
        _results.push(control.content());
      }
      return _results;
    })();
    return this._itemContents(itemContents);
  };

  return ListComboBox;

})(ComboBox);

/*
A popup menu. This is typically used in a Menu bar.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Menu = (function(_super) {

  __extends(Menu, _super);

  function Menu() {
    Menu.__super__.constructor.apply(this, arguments);
  }

  Menu.prototype.inherited = {
    popup: [
      {
        html: "<div/>",
        ref: "shield"
      }, {
        html: "<div/>",
        ref: "Menu_popup"
      }
    ],
    generic: "true"
  };

  Menu.prototype.initialize = function() {
    var _this = this;
    return this.$PopupSource_popup().on("click", function(event) {
      var $menuItem;
      $menuItem = $(event.target).closest(".MenuItem");
      if ($menuItem.length === 0) {
        return event.stopPropagation();
      }
    });
  };

  Menu.prototype.open = function() {
    this._updateShield();
    return Menu.__super__.open.call(this);
  };

  Menu.prototype.popup = Control.chain("$Menu_popup", "content");

  Menu.prototype._requiredClasses = ["MenuItem"];

  Menu.prototype._updateShield = function() {
    var $content, shieldWidth;
    $content = this.$PopupSource_content();
    shieldWidth = $content.width() + parseFloat($content.css("padding-left")) + parseFloat($content.css("padding-right"));
    return this.$shield().width(shieldWidth);
  };

  return Menu;

})(PopupSource);

/*
A mobile-optimzed date text box.
This leverages the device's native date picker UI.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.MobileDateTextBox = (function(_super) {

  __extends(MobileDateTextBox, _super);

  function MobileDateTextBox() {
    MobileDateTextBox.__super__.constructor.apply(this, arguments);
  }

  MobileDateTextBox.prototype.date = Control.iterator(function(date) {
    var content;
    if (date === void 0) {
      content = this.content();
      if (content) {
        return this._convertRfc3339ToJavaScriptDate(content);
      } else {
        return null;
      }
    } else {
      return this.content(this._convertJavaScriptDateToRfc3339(date));
    }
  });

  MobileDateTextBox.prototype.initialize = function() {
    if (!Control.browser.msie) {
      return this.prop("type", "date");
    }
  };

  MobileDateTextBox.prototype._convertJavaScriptDateToRfc3339 = function(date) {
    var isoDate, parts;
    isoDate = date.toISOString();
    parts = isoDate.split("T");
    return parts[0];
  };

  MobileDateTextBox.prototype._convertRfc3339ToJavaScriptDate = function(rfc3339date) {
    var date, parts;
    parts = rfc3339date.split("-");
    date = new Date();
    date.setFullYear(parseInt(parts[0]));
    date.setMonth(parseInt(parts[1] - 1));
    date.setDate(parseInt(parts[2]));
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };

  return MobileDateTextBox;

})(TextBox);

/*
An overlay for a modal dialog which absorbs all clicks.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ModalOverlay = (function(_super) {

  __extends(ModalOverlay, _super);

  function ModalOverlay() {
    ModalOverlay.__super__.constructor.apply(this, arguments);
  }

  ModalOverlay.prototype.initialize = function() {
    var _this = this;
    return this.on({
      click: function(event) {
        return event.stopPropagation();
      },
      "DOMMouseScroll mousewheel": function(event) {
        return event.preventDefault();
      }
    });
  };

  return ModalOverlay;

})(Overlay);

/*
Pick exactly one child to show at a time.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Modes = (function(_super) {

  __extends(Modes, _super);

  function Modes() {
    Modes.__super__.constructor.apply(this, arguments);
  }

  Modes.prototype.initialize = function() {
    var _this = this;
    this.on("layout sizeChanged", function() {
      return _this._sizeChanged();
    });
    return this.inDocument(function() {
      return this._sizeChanged();
    });
  };

  Modes.prototype.maximize = Control.chain("applyClass/maximize");

  Modes.prototype._sizeChanged = function() {
    var childHeights, element, elements, maxChildHeight;
    elements = this.elements();
    if (!(this.maximize() && elements.length > 0)) {
      return;
    }
    childHeights = (function() {
      var _i, _len, _ref, _results;
      _ref = elements.segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push(element.outerHeight(true));
      }
      return _results;
    })();
    maxChildHeight = Math.max.apply(Math, childHeights);
    if (maxChildHeight > 0) {
      return this.height(maxChildHeight);
    }
  };

  return Modes;

})(Sequence);

/*
A button that produces a popup when clicked.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.PopupButton = (function(_super) {

  __extends(PopupButton, _super);

  function PopupButton() {
    PopupButton.__super__.constructor.apply(this, arguments);
  }

  PopupButton.prototype.inherited = {
    contentClass: "BasicButton",
    content: [
      {
        html: "<div/>",
        ref: "PopupButton_content"
      }, {
        html: "<div>▼</div>",
        ref: "indicator"
      }
    ],
    generic: "true"
  };

  PopupButton.prototype.content = Control.chain("$PopupButton_content", "content", function(content) {
    var display;
    display = (content != null ? content.length : void 0) > 0 ? "inline-block" : "none";
    return this.$PopupButton_content().css("display", display);
  });

  PopupButton.prototype.indicator = Control.chain("$indicator", "content");

  PopupButton.prototype.quiet = Control.chain("$PopupSource_content", "quiet");

  return PopupButton;

})(PopupSource);

/*
Rotates once through a set of elements automatically when control is loaded.
The rotation stops if the user clicks to navigate to a specific page.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.RotatingPanelsWithDots = (function(_super) {

  __extends(RotatingPanelsWithDots, _super);

  function RotatingPanelsWithDots() {
    RotatingPanelsWithDots.__super__.constructor.apply(this, arguments);
  }

  RotatingPanelsWithDots.prototype.initialize = function() {
    var _this = this;
    this.click(function() {
      return _this.stop();
    });
    return this.inDocument(function() {
      return this._queueRotation();
    });
  };

  RotatingPanelsWithDots.prototype.rotate = Control.iterator(function() {
    var count, index;
    count = this.elements().length;
    if (count > 0) {
      index = this.activeIndex();
      index = (index + 1) % count;
      this.activeIndex(index);
      if (index > 0) {
        this._queueRotation();
      }
    }
    return this;
  });

  RotatingPanelsWithDots.prototype.rotationInterval = Control.property.integer(null, 1000);

  RotatingPanelsWithDots.prototype.stop = Control.iterator(function() {
    clearTimeout(this._timeout());
    this._timeout(null);
    return this;
  });

  RotatingPanelsWithDots.prototype._queueRotation = function() {
    var rotationInterval,
      _this = this;
    rotationInterval = this.rotationInterval();
    return this._timeout(setTimeout(function() {
      return _this.rotate();
    }, rotationInterval));
  };

  RotatingPanelsWithDots.prototype._timeout = Control.property();

  return RotatingPanelsWithDots;

})(SlidingPanelsWithDots);

/*
A typical web search box. Ensures search string is non-empty, and pressing
Enter launches search.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.SearchBox = (function(_super) {

  __extends(SearchBox, _super);

  function SearchBox() {
    SearchBox.__super__.constructor.apply(this, arguments);
  }

  SearchBox.prototype.inherited = {
    goButtonContent: [
      {
        html: "<img src='http://quickui.org/release/resources/search_16x16.png'/>",
        ref: "searchIcon"
      }
    ],
    placeholder: "Search"
  };

  SearchBox.prototype.initialize = function() {
    var hostname,
      _this = this;
    if (!this.query()) {
      hostname = window.location.hostname;
      this.query("http://www.google.com/search?q=%s+site%3A" + hostname);
    }
    return this.on("goButtonClick", function() {
      return _this.search();
    });
  };

  SearchBox.prototype.query = Control.property();

  SearchBox.prototype.search = Control.iterator(function() {
    var url, _ref;
    url = (_ref = this.query()) != null ? _ref.replace("%s", this.content()) : void 0;
    return window.location.href = url;
  });

  return SearchBox;

})(TextBoxWithButton);

/*
A combo box optimized for selecting colors.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.ColorSwatchComboBox = (function(_super) {

  __extends(ColorSwatchComboBox, _super);

  function ColorSwatchComboBox() {
    ColorSwatchComboBox.__super__.constructor.apply(this, arguments);
  }

  ColorSwatchComboBox.prototype.inherited = {
    itemClass: "LabeledColorSwatch",
    textBoxClass: "ColorSwatchTextBox"
  };

  ColorSwatchComboBox.prototype.initialize = function() {
    var _ref;
    if (!((_ref = this.items()) != null ? _ref.length : void 0) > 0) {
      return this.items(["Black", "Blue", "Gray", "Green", "Red", "Orange", "Pink", "Purple", "Yellow"]);
    }
  };

  return ColorSwatchComboBox;

})(ListComboBox);

/*
A control with separate edit and read modes.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.Editable = (function(_super) {

  __extends(Editable, _super);

  function Editable() {
    Editable.__super__.constructor.apply(this, arguments);
  }

  Editable.prototype.inherited = {
    content: [
      {
        html: "<div tabindex=\"-1\" />",
        ref: "Editable_read"
      }, {
        html: "<div/>",
        ref: "Editable_edit"
      }
    ],
    generic: "true"
  };

  Editable.prototype.cancel = Control.iterator(function() {
    return this.editing(false);
  });

  Editable.prototype.content = function(value) {
    if (this.editing()) {
      return this._editContent(value);
    } else {
      return this._readContent(value);
    }
  };

  Editable.prototype.editClass = Control.property["class"](function(editClass) {
    if (this.editing()) {
      return this._ensureEditControl();
    }
  });

  Editable.prototype.editControl = Control.chain("$Editable_edit");

  Editable.prototype.editing = Control.chain("applyClass/editing", function(editing) {
    var control, _i, _len, _ref, _results;
    if (editing === void 0) {
      return this._editing();
    } else {
      _ref = this.segments();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        control = _ref[_i];
        if (editing) {
          control._editContent(control._readContent());
          _results.push(control.activeElement(control.$Editable_edit()));
        } else {
          control.activeElement(control.$Editable_read());
          _results.push(control.readControl().focus());
        }
      }
      return _results;
    }
  });

  Editable.prototype.readClass = Control.property["class"](function(readClass) {
    var $new;
    $new = this.$Editable_read().transmute(readClass, true);
    return this.referencedElement("Editable_read", $new);
  });

  Editable.prototype.readControl = Control.chain("$Editable_read");

  Editable.prototype.save = Control.iterator(function() {
    this._readContent(this._editContent());
    return this.editing(false);
  });

  Editable.prototype._editContent = function(content) {
    this._ensureEditControl();
    return this.$Editable_edit().content(content);
  };

  Editable.prototype._createEditControl = function() {
    var $new, editClass;
    editClass = this.editClass();
    $new = this.$Editable_edit().transmute(editClass, true);
    return this.referencedElement("Editable_edit", $new);
  };

  Editable.prototype._ensureEditControl = function() {
    var currentClass, desiredClass;
    currentClass = this.$Editable_edit().controlClass();
    desiredClass = this.editClass();
    if (desiredClass !== currentClass) {
      return this._createEditControl();
    }
  };

  Editable.prototype._readContent = function(content) {
    var result;
    if (content === void 0) {
      result = this.$Editable_read().content();
      if (result instanceof jQuery && result.length === 0) {
        return null;
      } else {
        return result;
      }
    } else {
      this.$Editable_read().content(content);
      return this;
    }
  };

  return Editable;

})(Modes);

/*
A text region that can be clicked to edit its contents.
*/

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.EditableText = (function(_super) {

  __extends(EditableText, _super);

  function EditableText() {
    EditableText.__super__.constructor.apply(this, arguments);
  }

  EditableText.prototype.inherited = {
    editClass: "TextBox"
  };

  EditableText.prototype.cancelOnEscape = Control.property(null, true);

  EditableText.prototype.editing = function(editing) {
    var result;
    result = EditableText.__super__.editing.call(this, editing);
    if (editing) {
      this.editControl().find("input").addBack().focus();
    }
    return result;
  };

  EditableText.prototype.editOnClick = Control.property(null, true);

  EditableText.prototype.initialize = function() {
    var _this = this;
    return this.click(function() {
      if (_this.editOnClick() && !_this.editing()) {
        return _this.editing(true);
      }
    });
  };

  EditableText.prototype.saveOnEnter = Control.property(null, true);

  EditableText.prototype._createEditControl = function() {
    var result,
      _this = this;
    result = EditableText.__super__._createEditControl.call(this);
    this.editControl().find("input").addBack().on({
      blur: function() {
        if (_this.editing()) {
          return _this.save();
        }
      },
      keydown: function(event) {
        if (_this.editing()) {
          switch (event.which) {
            case 13:
              if (_this.saveOnEnter()) {
                _this.save();
                return event.preventDefault();
              }
              break;
            case 27:
              if (_this.cancelOnEscape()) {
                return _this.cancel();
              }
          }
        }
      }
    });
    return result;
  };

  return EditableText;

})(Editable);

})();