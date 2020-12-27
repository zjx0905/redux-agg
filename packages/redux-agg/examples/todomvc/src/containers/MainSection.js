import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MainSection from '../components/MainSection';
import { todosActions } from '../models';
import { getCompletedTodoCount } from '../selectors';

const mapStateToProps = (state) => ({
  todosCount: state.todos.length,
  completedCount: getCompletedTodoCount(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(todosActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainSection);
