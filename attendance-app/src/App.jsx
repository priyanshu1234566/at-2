import { useEffect, useState } from "react";

export default function App() {
  const [students, setStudents] = useState([]);
  const [output, setOutput] = useState([]);
  const [dark, setDark] = useState(false);

  const [form, setForm] = useState({
    university: "",
    college: "",
    course: "",
    search: "",
  });

  /* ✅ Load Data */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("attendance")) || [];
    setStudents(saved);
  }, []);

  /* ✅ Save Data */
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(students));
  }, [students]);

  /* ✅ Add Student */
  const addStudent = () => {
    setStudents([
      ...students,
      {
        name: "",
        className: "",
        roll: "",
        days: Array(6).fill(false),
      },
    ]);
  };

  /* ✅ Delete Last */
  const deleteRow = () => {
    setStudents(students.slice(0, -1));
  };

  /* ✅ Toggle Attendance */
  const toggleDay = (i, d) => {
    const updated = [...students];
    updated[i].days[d] = !updated[i].days[d];
    setStudents(updated);
  };

  /* ✅ Update Field */
  const updateField = (i, key, value) => {
    const updated = [...students];
    updated[i][key] = value;
    setStudents(updated);
  };

  /* ✅ Calculate */
  const calc = (days) => {
    const present = days.filter(Boolean).length;
    const percent = ((present / 6) * 100).toFixed(0);
    return { present, percent };
  };

  /* ✅ Show Output */
  const generateReport = () => {
    const today = new Date().toISOString().split("T")[0];

    const data = students
      .filter((s) => s.name)
      .map((s) => {
        const present = s.days.filter(Boolean).length;
        const total = s.days.length;
        return {
          ...form,
          ...s,
          present,
          absent: total - present,
          percent: ((present / total) * 100).toFixed(0),
          date: today,
          id: Date.now() + Math.random(),
        };
      });

    setOutput(data);
  };

  /* ✅ CSV Download */
  const downloadCSV = () => {
    let csv = [
      ["Name", "Class", "Roll", "Present", "%"],
      ...students.map((s) => {
        const r = calc(s.days);
        return [s.name, s.className, s.roll, r.present, r.percent];
      }),
    ];

    const blob = new Blob([csv.map((r) => r.join(",")).join("\n")]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attendance.csv";
    a.click();
  };

  return (
    <div className={`${dark ? "bg-gray-900 text-white" : "bg-gray-100"} min-h-screen p-4`}>

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">📊 Attendance System</h1>
        <button
          onClick={() => setDark(!dark)}
          className="bg-blue-500 px-4 py-2 rounded text-white"
        >
          🌙 Dark
        </button>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        {["university", "college", "course", "search"].map((f) => (
          <input
            key={f}
            placeholder={f}
            className="p-2 border rounded"
            value={form[f]}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border min-w-[800px]">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>SR</th>
              <th>Name</th>
              <th>Class</th>
              <th>Roll</th>
              {["M", "T", "W", "Th", "F", "Sat"].map((d) => (
                <th key={d}>{d}</th>
              ))}
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>
            {students
              .filter((s) =>
                s.name.toLowerCase().includes(form.search.toLowerCase())
              )
              .map((s, i) => {
                const r = calc(s.days);
                return (
                  <tr key={i} className="text-center border">
                    <td>{i + 1}</td>

                    <td>
                      <input
                        value={s.name}
                        onChange={(e) =>
                          updateField(i, "name", e.target.value)
                        }
                        className="border p-1"
                      />
                    </td>

                    <td>
                      <input
                        value={s.className}
                        onChange={(e) =>
                          updateField(i, "className", e.target.value)
                        }
                        className="border p-1"
                      />
                    </td>

                    <td>
                      <input
                        value={s.roll}
                        onChange={(e) =>
                          updateField(i, "roll", e.target.value)
                        }
                        className="border p-1"
                      />
                    </td>

                    {s.days.map((d, di) => (
                      <td key={di}>
                        <input
                          type="checkbox"
                          checked={d}
                          onChange={() => toggleDay(i, di)}
                        />
                      </td>
                    ))}

                    <td>{r.present}</td>
                    <td>{r.percent}%</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4 flex-wrap">
        <button onClick={addStudent} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add
        </button>

        <button onClick={deleteRow} className="bg-red-500 text-white px-4 py-2 rounded">
          Delete
        </button>

        <button onClick={generateReport} className="bg-green-500 text-white px-4 py-2 rounded">
          Show Data
        </button>

        <button onClick={downloadCSV} className="bg-gray-300 px-4 py-2 rounded">
          Download CSV
        </button>
      </div>

      {/* Output */}
      {output.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">📋 Report</h2>

          <table className="w-full border">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Roll</th>
                <th>Present</th>
                <th>Absent</th>
                <th>%</th>
              </tr>
            </thead>

            <tbody>
              {output.map((o) => (
                <tr key={o.id} className="text-center border">
                  <td>{o.name}</td>
                  <td>{o.className}</td>
                  <td>{o.roll}</td>
                  <td>{o.present}</td>
                  <td>{o.absent}</td>
                  <td>{o.percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}