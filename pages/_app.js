import '../styles/global.css'

export default function({ component, page_properties }) {
  return (
    <div className="root">
      <component { ... page_properties } /> 
    </div>
    );
};
