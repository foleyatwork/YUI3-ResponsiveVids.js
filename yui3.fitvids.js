YUI.add('fit-vids', function (Y) {
  Y.Plugin.FitVids = Y.Base.create('fitvids', Y.Plugin.Base, [], {

    initializer: function () {
      var customSelector = this.get('customSelector');
      var customIgnore = this.get('ignore');

      this.selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];
      this.ignoreList = '.fitvidsignore';

      if (customSelector) {
        this.selectors.push(customSelector);
      }

      if (customIgnore) {
        this.ignoreList = this.ignoreList + ',' + customIgnore;
      }

      Y.all(this.selectors.join(',')).each(function (video) {
        if (this._ignore(video) == true) {
          return false;
        }

        var height = video.get('clientHeight');
        var width = video.get('clientWidth');
        var aspect = !height || !width ? (9 / 16 * 100) : (height / width * 100) + '%';
        var widthAttr = video.getAttribute('width');
        var heightAttr = video.getAttribute('height');
        var wrapper = Y.Node.create('<div class="fluid-width-video-wrapper"></div>');

        if (widthAttr) {
          video.setAttribute('data-width', widthAttr);
          video.removeAttribute('width');
        }

        if (heightAttr) {
          video.setAttribute('data-height', heightAttr);
          video.removeAttribute('height');
        }

        wrapper.append(video.replace(wrapper)).setStyles({
          height: 0,
          paddingTop: aspect,
          position: 'relative'
        });

        video.setStyles({
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        });
      }, this);
    },

    destructor: function () {
      Y.all(this.selectors.join(',')).each(function (video) {
        if (this._ignore(video) == true) {
          return false;
        }
        
        var wrapper = video.ancestor('.fluid-width-video-wrapper');

        video.setAttribute('width', video.getData('width').setData('width', ''));
        video.setAttribute('height', video.getData('height').setData('height', ''));
        video.removeAttribute('style')

        wrapper.replace(wrapper.getHTML());
      }, this);
    },
    
    _ignore: function (video) {
      if (
        video.test(this.ignoreList) ||
        video.test('object object') ||
        video.ancestor(this.ignoreList)
      ) {
        return true;
      }
      
      return false;
    }
    
  }, {
    NS: 'fitvids',
    ATTRS: {
      customSelector: {
        value: null // Selector string.
      },
      ignore: {
        value: null // Selector string.
      }
    }
  });
}, 
  '1.0',
  {
    requires: [
      'base',
      'node',
      'plugin',
      'event'
    ]
  }
);