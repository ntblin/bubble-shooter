"use strict";

var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Game = (function($) {
  var Game = function() {
    var board;
    var curBubble;
    var numBubbles;
    var MAX_BUBBLES = 70; 
    this.init = function() {
      $(".but_start_game").bind("click", startGame);
    };

    function startGame () {
      console.log('Game is started'); 
      $(".but_start_game").unbind("click");
      numBubbles = MAX_BUBBLES;
      BubbleShoot.ui.hideDialog();
      curBubble = getNextBubble();
      board = new BubbleShoot.Board();
      BubbleShoot.ui.drawBoard(board);
      $("#game").bind("click", clickGameScreen);
    }

    function getNextBubble() {
      var bubble = BubbleShoot.Bubble.create();
      var sprite = bubble.getSprite();
      sprite.addClass("cur_bubble");
      $("#board").append(sprite);
      BubbleShoot.ui.drawBubblesRemaining(numBubbles);
      numBubbles--;
      return bubble;
    }

    function clickGameScreen (e) {
      var angle = BubbleShoot.ui.getBubbleAngle(curBubble.getSprite(), e);
      var duration = 750;
      var distance = 1000;
      var collision = BubbleShoot.CollisionDetector.findIntersection(curBubble,
        board, angle);
      if (collision) {
        var coords = collision.coords;
        duration = Math.round(duration * collision.distToCollision / distance);
        board.addBubble(curBubble, coords);
        var group = board.getGroup(curBubble, {});
        if (group.list.length >= 3) {
          popBubbles(group.list, duration);
        }      
      } else {
        var distX = Math.sin(angle) * distance;
        var distY = Math.cos(angle) * distance;
        var bubbleCoords = BubbleShoot.ui.getBubbleCoords(curBubble.getSprite());
        var coords = {
          x: bubbleCoords.left + distX,
          y: bubbleCoords.top - distY 
        };
      }
      BubbleShoot.ui.fireBubble(curBubble, coords, duration);
      curBubble = getNextBubble();    
    }

    function popBubbles (bubbles, delay) {
      $.each(bubbles,function () {
        var bubble = this;
        board.popBubbleAt(this.getRow(), this.getCol());
        setTimeout(function() {
          bubble.getSprite().remove();
        }, delay + 200);
      })
    }
  };
  return Game;  
})(jQuery);
