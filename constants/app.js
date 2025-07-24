const TABLE_HEADER = `
  <tr>
    <th class="table-cell">S.N</th>
    <th class="table-cell">Subject</th>
    <th class="table-cell">Full Marks</th>
    <th class="table-cell">Pass Marks</th>
    <th class="table-cell">Obtained Marks</th>
    <th class="table-cell">Grade</th>
    <th class="table-cell">Grade Point</th>
  </tr>
`;

const COMMON_HTML_FOR_SHEETS = `
  <div class="margin-top-20">
    <table class="table margin-top-20">
      <thead>
        <tr>
          <th class="table-cell">Percentage</th>
          <th class="table-cell">Grade</th>
          <th class="table-cell">Grade Point</th>
          <th class="table-cell">Detail</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="table-cell">90-100</td>
          <td class="table-cell">A+</td>
          <td class="table-cell">4</td>
          <td class="table-cell">Outstanding</td>
        </tr>
        <tr>
          <td class="table-cell">80-90</td>
          <td class="table-cell">A</td>
          <td class="table-cell">3.6</td>
          <td class="table-cell">Excellent</td>
        </tr>
        <tr>
          <td class="table-cell">70-80</td>
          <td class="table-cell">B+</td>
          <td class="table-cell">3.2</td>
          <td class="table-cell">Very Good</td>
        </tr>
        <tr>
          <td class="table-cell">60-70</td>
          <td class="table-cell">B</td>
          <td class="table-cell">2.8</td>
          <td class="table-cell">Good</td>
        </tr>
        <tr>
          <td class="table-cell">50-60</td>
          <td class="table-cell">C+</td>
          <td class="table-cell">2.4</td>
          <td class="table-cell">Satisfactory</td>
        </tr>
        <tr>
          <td class="table-cell">40-50</td>
          <td class="table-cell">C</td>
          <td class="table-cell">2</td>
          <td class="table-cell">Acceptable</td>
        </tr>
        <tr>
          <td class="table-cell">30-40</td>
          <td class="table-cell">D+</td>
          <td class="table-cell">1.6</td>
          <td class="table-cell">Partially Acceptable</td>
        </tr>
        <tr>
          <td class="table-cell">20-30</td>
          <td class="table-cell">D</td>
          <td class="table-cell">1.2</td>
          <td class="table-cell">Insufficient</td>
        </tr>
        <tr>
          <td class="table-cell">0-20</td>
          <td class="table-cell">E</td>
          <td class="table-cell">0.8</td>
          <td class="table-cell">Very Insufficient</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="margin-top-20">
    <div class="remarks-container">
      <div style="width: 100%">
        <h4>Remarks:</h4>
        <ul class="remarks-list">
          <li class="remarks-item">
            <label for="congratulation"
              >Congratulation</label
            >
            <input type="checkbox" id="congratulation" name="congratulation" class="large-checkbox" />
          </li>
          <li class="remarks-item">
            <label for="well-done"
              >Well Done</label
            >
            <input type="checkbox" id="well-done" name="well-done" class="large-checkbox" />
          </li>
          <li class="remarks-item">
            <label for="well"
              >Well</label
            >
            <input type="checkbox" id="well" name="well" class="large-checkbox" />
          </li>
          <li class="remarks-item">
            <label for="satisfactory"
              >Satisfactory</label
            >
            <input type="checkbox" id="satisfactory" name="satisfactory" class="large-checkbox" />
          </li>
        </ul>
      </div>
    </div>
  </div>
`