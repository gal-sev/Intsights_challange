import "./paste.scss";
export function Paste(props) {

  return (
    <div className="paste_container">
      <h1 className="title">{props.title}</h1>
      <p className="contentFull">{props.contentFull}</p>
      <div className="footer_info">
        <span className="author">by {props.author}</span>
        <span className="date">{props.date}</span>
      </div>
    </div>
  );
}

export default Paste;
