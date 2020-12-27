import { connect } from 'react-redux';
import Header from '../components/Header';
import { todosActions } from '../models';

export default connect(null, { add: todosActions.add })(Header);
