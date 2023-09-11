const jwt = require("jsonwebtoken");
const config = "Server=.;Database=p2;User Id=sa;Password=123456;Encrypt=true";
const sql = require("mssql");
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQLServer...");
    return pool;
  })
  .catch((err) => console.log("Database Connection Failed! Bad Config: ", err));

const register = async (req, res) => {
  const newUser = req.body;
  const email = newUser.email;
  const password = newUser.password;
  const fullName = newUser.fullName;
  try {
    const pool = await poolPromise;
    var query = `INSERT INTO PollUsers (email, password, fullName) VALUES ('${email}', '${password}', '${fullName}')`;
    const rs = await pool.request().query(query);
    res.status(200).send();
  } catch (error) {
    res.status(400).send("Can't register user");
  }
};
const login = async (req, res) => {
  const userInfo = req.body;
  const email = userInfo.email;
  const password = userInfo.password;
  try {
    const pool = await poolPromise;
    var query = `SELECT * FROM PollUsers WHERE email='${email}' AND password = '${password}';`;
    const rs = await pool.request().query(query);
    const user = rs.recordset[0];
    if (user == null) {
      res.status(404).send("User not found");
    } else {
      const payload = { subject: user };
      try {
        var token = jwt.sign(payload, process.env.SECRET, {
          expiresIn: "10min",
        });
        console.log(token);
      } catch (error) {
        console.log(error);
      }
      res.send(token);
    }
  } catch (error) {
    res.status(400).send("Can't querry");
  }
};
module.exports = { register, login };
