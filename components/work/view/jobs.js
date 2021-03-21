import React from 'react';
import { Selector } from 'components/utils';
import propTypes from 'prop-types';

const initialJobs = [
  { value: '12345', label: 'ACME Dynamite' },
  { value: '67890', label: 'ACME Web Design' },
];

class Jobs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobId: null,
    };
  }

  handleChange(data) {
    const jobId = data ? data.value : null;

    if (this.props.getJob) {
      this.props.getJob(jobId);
    }
    this.setState({
      jobId,
    });
  }

  render() {
    return (
      <div className="jobs-container">
        <Selector
          label="Select or add a job"
          vertical
          isClearable
          value={this.state.jobId}
          options={initialJobs}
          handleChange={(data) => this.handleChange(data)}
        />
      </div>
    );
  }
}

export default Jobs;

Jobs.propTypes = {
  getJob: propTypes.func.isRequired,
};