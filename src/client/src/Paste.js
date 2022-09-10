export function Paste(props) {

  return (
    <div className="paste_container">
      <h1 className="title">{props.title} by {props.author}</h1>
      <p className="contentFull">{props.contentFull}</p>
      <p className="date">{props.date}</p>
    </div>
  );
}

export default Paste;
