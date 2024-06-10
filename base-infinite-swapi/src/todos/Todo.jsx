import { forwardRef } from "react";
import PropTypes from "prop-types";
const TodoCard = forwardRef(({ todo }, ref) => {
  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px",
    marginBottom: "10px",
  };
  return (
    <div ref={ref} style={cardStyle}>
      <h3>{todo.title}</h3>
    </div>
  );
});
TodoCard.displayName = "TodoCard";
TodoCard.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
};

export { TodoCard };
