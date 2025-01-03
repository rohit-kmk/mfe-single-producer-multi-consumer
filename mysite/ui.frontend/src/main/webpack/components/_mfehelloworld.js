// Example of how a component should be initialized via JavaScript
// This script logs the value of the component's text property model message to the console
import "./_mfehelloworld.css";

const helloworld = () => {
  console.log("********* Hello World *********");
  // Create an h4 element
  const h4 = document.createElement('h4');
  
  // Set the content of the h4 element
  h4.textContent = 'This is a dynamically appended h4 tag';

  // Append the h4 element to the body
  document.body.appendChild(h4);
};

export { helloworld };
