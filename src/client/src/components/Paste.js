import "./paste.scss";
export function Paste(props) {

  return (
    <div className="paste_container">
      <h1 className="title" style={{color: sentimentColor(props.sentiment)}}>{props.title}</h1>
      <p className="contentFull">{props.content}</p>
      <div className="footer_info">
        <span className="author">by {props.author}</span>
        <span className="date">{props.date}</span>
      </div>
    </div>
  );
}

function sentimentColor(sentimentVal) {
  const redBase = "#ff0000";
  const greenBase = "#008000";
  // Lighten or darken the color based on the sentimental value
  if (sentimentVal > 0) {
    let red = parseInt(greenBase[1] + greenBase[2],16) + (3 * sentimentVal);
    let green = parseInt(greenBase[3] + greenBase[4],16) + (3 * sentimentVal);
    let blue = parseInt(greenBase[5] + greenBase[6], 16) + (3 * sentimentVal);
    return 'rgba('+red+','+green+','+blue+')';
  } else if (sentimentVal < 0) {
    let red = parseInt(redBase[1] + redBase[2],16) + (3 * sentimentVal);
    let green = parseInt(redBase[3] + redBase[4],16) + (3 * sentimentVal);
    let blue = parseInt(redBase[5] + redBase[6], 16) + (3 * sentimentVal);
    return 'rgba('+red+','+green+','+blue+')';
  } else {
    return "white";
  }
}

export default Paste;
