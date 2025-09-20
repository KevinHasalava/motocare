import React, { useEffect, useState } from "react";
import axios from "axios";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        setError("⚠️ Error fetching jobs: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  if (loading) return <p>⏳ Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Jobs List</h2>
      <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Service</th>
            <th>Mechanic</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length === 0 ? (
            <tr><td colSpan="10">No jobs</td></tr>
          ) : (
            jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.jobId}</td>
                <td>{job.user?.name}</td>
                <td>{job.vehicle?.vehicleNumber} ({job.vehicle?.brand})</td>
                <td>{job.service?.name}</td>
                <td>{job.mechanic ? job.mechanic.name : "❌ Not assigned"}</td>
                <td>
                  {job.startTime
                    ? new Date(job.startTime).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {job.startTime && job.endTime
                    ? `${new Date(job.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })} - ${new Date(job.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}`
                    : "N/A"}
                </td>
                <td>
                  {job.startTime && job.endTime
                    ? Math.round((new Date(job.endTime) - new Date(job.startTime)) / 60000) + " mins"
                    : "N/A"}
                </td>
                <td>{job.status}</td>
                <td>
                  <button onClick={() => updateStatus(job._id, "Ongoing")} disabled={job.status === "Ongoing"}>Ongoing</button>
                  <button onClick={() => updateStatus(job._id, "Complete")} disabled={job.status === "Complete"}>Complete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobsPage;