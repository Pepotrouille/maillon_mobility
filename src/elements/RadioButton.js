import React, { Component } from 'react';

class RadioButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      effort_level: '',
    };
  }

  onEffortLevelChanged = (e) => {
    this.setState({
        effort_level: e.currentTarget.value,
    });
  };

  render() {
    const resultRows = this.props.data.map((result) => (
      <tbody key={result.EFFORT_LEVEL}>
        <tr>
          <td>
            <input
              type="radio"
              name="Effort Level"
              value={result.EFFORT_LEVEL}
              checked={this.state.effort_level === result.EFFORT_LEVEL}
              onChange={this.onEffortLevelChanged}
            />
            {result.EFFORT_LEVEL}
          </td>
        </tr>
      </tbody>
    ));

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Effort Level</th>
          </tr>
        </thead>
        {resultRows}
        <tfoot>
          <tr>
            <td>chosen effort level: {this.state.effort_level} </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

export default RadioButton;