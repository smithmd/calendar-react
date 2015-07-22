/**
 * Created by smithmd on 7/21/15.
 */
var CommentBox = React.createClass({displayName: "CommentBox",
  render: function () {
    return (
        React.createElement("div", {className: "commentBox"}, 
          "Hello, world! I am a comment box!"
        )
    );
  }
});
React.render();