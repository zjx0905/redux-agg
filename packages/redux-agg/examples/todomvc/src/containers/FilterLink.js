import { connect } from 'react-redux';
import { visibilityFilterActions } from '../models';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => ({
  active: ownProps.filter === state.visibilityFilter,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  setFilter: () => {
    dispatch(visibilityFilterActions.set(ownProps.filter));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Link);
