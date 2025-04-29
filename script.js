document.addEventListener("DOMContentLoaded", function () {
  // Get elements by class
  const fileInput = document.querySelector(".file-input");
  const numSubjectsInput = document.getElementById("num-subjects");
  const gradeInput = document.getElementById("grade-input");
  const totalAttendanceInput = document.getElementById(
    "total-attendance-input",
  );

  const subjectDialogue = document.querySelector("#subject-dialog");
  const resultHolder = document.querySelector("#result-holder");

  const exportButton = document.getElementById("export-btn");
  exportButton.style.display = "none";

  // Handle file upload
  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file type is Excel
    if (
      file.type !== "application/vnd.ms-excel" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Please upload an Excel file (.xls or .xlsx)");
      return;
    }

    // Read the file
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {
          type: "array",
        });

        // Get the first sheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        const [[_, ...subjectRows], ...dataRows] = rows;

        const numberOfSubjectValue = parseInt(numSubjectsInput.value);
        const gradeValue = gradeInput.value;
        const attendanceValue = parseInt(totalAttendanceInput.value);

        const endColumn = isNaN(numberOfSubjectValue)
          ? 5
          : numberOfSubjectValue;
        const subjects = subjectRows.slice(0, endColumn);
        const rankIndex = subjectRows.findIndex( (value) => value?.toLowerCase() == "rank" )
        const schoolDaysIndex = subjectRows.findIndex(value => value?.toLowerCase() == 'ta')
        const rollNumberIndex = subjectRows.findIndex(value => value?.toLowerCase() == 'roll')

        if ([rankIndex, schoolDaysIndex, rollNumberIndex].includes(-1)) {
          console.error("Either rank or school days or roll number is missing in sheet")

          return
        }

        // Display subjects
        let html = subjects
          .map((subject, index) => {
            const subjectLabel = getSubjectLabel(subject);
            return `
                  <div class="dialog-row">
                    <div class="dialog-item">${subjectLabel}</div>
                    <div class="dialog-item">
                      <select name="[${index}]['fullMarks']">
                        <option value="100"> 100 </option>
                        <option value="50"> 50 </option>
                        <option value="grade"> Grade </option>
                      </select>
                      <input type="hidden" name="[${index}]['label']" value="${subjectLabel}" />
                    </div>
                  </div>
                `;
          })
          .join("");

        html += '<button type="submit">Submit</button>';

        const subjectForm = document.createElement("form");
        subjectForm.classList.add("table-row-group")
        subjectForm.innerHTML = html;
        subjectDialogue.append(subjectForm);

        subjectForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const formData = new FormData(subjectForm);
          const subjectFullMarksAndLabel = [];
          for (let [key, value] of formData.entries()) {
            const [_, idx, field] = key.match(/\[(\d+)\]\['([^']+)'\]/);

            if (!subjectFullMarksAndLabel[idx])
              subjectFullMarksAndLabel[idx] = {};
            subjectFullMarksAndLabel[idx][field] = value;
          }

          const allStudentsResult = [];
          for (const dataRow of dataRows) {
            const [studentName, ...studentMarks] = dataRow;

            const resultPage = prepareResult(
              studentName,
              studentMarks,
              subjectFullMarksAndLabel,
              {
                grade: gradeValue,
                schoolDays: attendanceValue,
                presentDays: studentMarks[schoolDaysIndex],
                rank: studentMarks[rankIndex],
                rollNo: studentMarks[rollNumberIndex]
              },
            );
            allStudentsResult.push(resultPage);
          }

          resultHolder.innerHTML = allStudentsResult.join("");
          subjectDialogue.classList.remove("table-display");


          // Display export button and create pdf file from the page
          exportButton.style.display = "block";
          exportButton.addEventListener("click", async function () {
            const pdf = new window.jspdf.jsPDF({
                orientation: "l",
                unit: "mm",
                format: "a4",
          });

          const resultPages = resultHolder.children;
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const promises = [];

          for (const [index, page] of Array.from(resultPages).entries()) {
            promises.push(
              html2canvas(page).then((canvas) => {
                const imageData = canvas.toDataURL("image/png");
                pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight);
                // Add new page only if it's not the last one
                if (index < resultPages.length - 1) {
                  pdf.addPage();
                }
              }),
            );
          }

          await Promise.all(promises);
          pdf.save(`${gradeInput.value}_result.pdf`);
        });
        });

        subjectDialogue.classList.add("table-display");
      } catch (error) {
        console.error(error);
      }
    };
    reader.onerror = function () {
      console.error(this.error);
    };
    reader.readAsArrayBuffer(file);
  });
});

const prepareResult = (
  studentName,
  studentMarks,
  subjectFullMarksAndLabel,
  { grade: studyGrade, schoolDays, presentDays, rank, rollNo },
) => {
  if (!studentName) {
    return "";
  }

  console.log(rank)

  let totalPassMark = 0,
    totalMark = 0,
    totalFullMark = 0,
    totalGradePoint = 0;

  const tableContents = subjectFullMarksAndLabel.map(
    ({ fullMarks, label }, index) => {
      const studentMark = studentMarks[index]
      const commonParams = {
        sn: index + 1,
        subjectLabel: label,
      }

      // If full marks is not provided or can't be converted to number just send grade in case of (drawing and rhymes)
      if (isNaN(fullMarks)) {
        return {
          ...commonParams,
          grade: studentMark,
        }
      }

      const passMark = fullMarks * 0.4;
      const obtainedMark = parseInt(studentMark);
      const [grade, gradePoint] = calculateGradeAndGradePoint(
        fullMarks,
        obtainedMark,
      );
      const fullMark = parseInt(fullMarks);

      totalFullMark += fullMark;
      totalPassMark += passMark;
      totalMark += obtainedMark;
      totalGradePoint += gradePoint;

      return {
        ...commonParams,
        obtainedMark,
        grade,
        gradePoint,
        fullMark,
        passMark,
      };
    },
  );

  const gPA = Number(
    (totalGradePoint / subjectFullMarksAndLabel.length).toFixed(2),
  );
  const percentage = Number(((totalMark / totalFullMark) * 100).toFixed(2));

  return `
    <div class="result-page">
          <div class="margin-top-50">
            ${getSheetHeader({
              studentName,
              grade: studyGrade,
              rollNo: rollNo,
            })}

              <div class="margin-top-50">
                  <table class="table">
                    <thead>
                        ${TABLE_HEADER}
                    </thead>
                      <tbody>
                        ${getMarksTableBody(tableContents)}
                      </tbody>
                      <tfoot>
                        ${getMarksTableFooter({
                          totalFullMark,
                          totalPassMark,
                          totalMark,
                          gPA,
                        })}
                      </tfoot>
                  </table>
              </div>

              <h5 class="margin-top-20">GPA: Grade Point Average</h5>
          </div>
          <div>
              <div class="margin-top-20">
                        ${getPercentageTable({ percentage, rank })}
              </div>
              <div class="margin-top-20">
                        ${getAttendanceTable({
                          totalDays: schoolDays,
                          presentDays,
                        })}
              </div>
              ${COMMON_HTML_FOR_SHEETS}
          </div>
      </div>
`;
};
