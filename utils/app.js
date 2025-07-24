const getSubjectKey = (subject) => {
  // Create key for subject assuming subject will be string and replace '-' with '_' for key creation
  const subjectKey = subject.toLowerCase().replaceAll("-", "_");

  return subjectKey;
};

const getSubjectLabel = (subject) => {
  // Create label for subject assuming subject will be string and replace '-' with ' ' and capitalize each word


  if (subject.includes(".")){
    return subject.toUpperCase()
  }


  const subjectLabel = subject
    .toLowerCase()
    .replaceAll("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return subjectLabel;
};

const getFormattedRank = (rank) => {
  let superScript = "th";

  if (rank.endsWith("1")) {
    superScript = "st";
  } else if (rank.endsWith("2")) {
    superScript = "nd";
  } else if (rank.endsWith("3")) {
    superScript = "rd";
  }

  return `${rank}<sup>${superScript}</sup>`;
};

const getSheetHeader = ({ studentName, grade, rollNo }) => `
              <h3 class="text-center">GRADE SHEET</h3>
              <div class="student-info-card">
                  <div>
                      <div>Name: ${studentName}</div>
                      <div class="margin-top-20">Roll No: ${rollNo}</div>
                  </div>
                  <div>Grade : ${grade}</div>
              </div>
`;

const getPercentageTable = ({ percentage, rank }) => `
                  <table class="table margin-top-20">
                      <tr>
                          <td class="table-cell font-bold">Percentage</td>
                          <td class="table-cell">${percentage}%</td>
                      </tr>
                      <tr>
                          <td class="table-cell font-bold">Rank</td>
                          <td class="table-cell">${getFormattedRank(`${rank}`)}</td>
                      </tr>
                  </table>
`;

const getMarksTableBody = (tableContents) =>
  tableContents
    .map(
      ({
        sn,
        subjectLabel,
        obtainedMark,
        grade,
        gradePoint,
        fullMark,
        passMark,
      }) =>
        `
            <tr>
                <td class="table-cell">${sn}.</td>
                <td class="table-cell">${subjectLabel}</td>
                <td class="table-cell">${fullMark ?? '-'}</td>
                <td class="table-cell">${passMark ?? '-'}</td>
                <td class="table-cell">${obtainedMark ?? '-'}</td>
                <td class="table-cell">${grade ?? '-'}</td>
                <td class="table-cell">${gradePoint ?? '-'}</td>
            </tr>
        `,
    )
    .join("");

const getMarksTableFooter = ({
  totalFullMark,
  totalPassMark,
  totalMark,
  gPA,
}) =>
  `
                          <tr>
                              <td colspan="2" class="table-cell font-bold">
                                  Total
                              </td>
                              <td class="table-cell">${totalFullMark}</td>
                              <td class="table-cell">${totalPassMark}</td>
                              <td class="table-cell">${totalMark}</td>
                              <td colspan="2" class="table-cell text-center">
                                  GPA: ${gPA}
                              </td>
                          </tr>
`;

const getAttendanceTable = ({ presentDays, totalDays }) => `
    <table class="table">
        <tr>
            <th class="table-cell"> School Days </th>
            <td class="table-cell"> ${totalDays} </td>
        </tr>

        <tr>
            <th class="table-cell"> Present Days </th>
            <td class="table-cell"> ${presentDays} </td>
        </tr>

        <tr>
            <th class="table-cell"> Absent Days </th>
            <td class="table-cell"> ${totalDays - presentDays} </td>
        </tr>
    </table>
`;

const calculateGradeAndGradePoint = (fullMarks, obtainedMarks) => {
  // Convert obtained marks equivalent to the marks with full marks of 100
  obtainedMarks = (100 / fullMarks) * obtainedMarks;

  if (obtainedMarks >= 90) return ["A+", 4.0];

  if (obtainedMarks >= 80) return ["A", 3.6];

  if (obtainedMarks >= 70) return ["B+", 3.2];

  if (obtainedMarks >= 60) return ["B", 2.8];

  if (obtainedMarks >= 50) return ["C+", 2.4];

  if (obtainedMarks >= 40) return ["C", 2.0];

  if (obtainedMarks >= 30) return ["D+", 1.6];

  if (obtainedMarks >= 20) return ["D", 1.2];

  return ["E", 0.8];
};
