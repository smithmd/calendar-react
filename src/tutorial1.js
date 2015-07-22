/**
 * Created by smithmd on 7/21/15.
 */
var CommentBox = React.createClass({
  render: function () {
    return (
        <div className="commentBox">
          Hello, world! I am a comment box!
        </div>
    );
  }
});
React.render(
    <CommentBox />,
    document.getElementById('content')
);