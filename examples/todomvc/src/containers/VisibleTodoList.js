import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TodoList from '../components/TodoList';
import { todosActions } from '../models';
import { getVisibleTodos } from '../selectors';

const mapStateToProps = (state) => ({
  filteredTodos: getVisibleTodos(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(todosActions, dispatch),
});

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);

export default VisibleTodoList;
