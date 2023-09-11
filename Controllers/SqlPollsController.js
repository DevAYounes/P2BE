const config = "Server=.;Database=p2;User Id=sa;Password=123456;Encrypt=true";
const sql = require("mssql");
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("polls Connected to SQLServer...");
    return pool;
  })
  .catch((err) => console.log("poll Database gone bad! ", err));

const addPolls = async (req, res) => {
  const email = req.params.email;
  const poll = req.body;
  const Options = poll.Options;
  try {
    const pool = await poolPromise;
    query = `SELECT * FROM PollUsers where email= '${email}'`;
    const rsUsers = await pool.request().query(query);
    const User = rsUsers.recordset;
    const UserId = User[0].Id;

    addQuery = `INSERT INTO [dbo].[PollCards]
    ([Title]
    ,[pollMaker]
    ,[Description]
    ,[PollUserID],[Time])
    VALUES
    ('${poll.Title}'
    ,'${email}'
    ,'${poll.Description}'
    ,'${UserId}','${poll.Time}')`;
    const InsertRes = await pool.request().query(addQuery);
    const OptionsIdQuery = `SELECT [Id]
    FROM [dbo].[PollCards]
    where Title ='${poll.Title}'`;
    const rsPolls = await pool.request().query(OptionsIdQuery);
    const pollrecord = rsPolls.recordset;
    const pollrecordId = pollrecord[0].Id;
    for (let i = 0; i < Options.length; i++) {
      const insrtOptQuery = `
        INSERT INTO [dbo].[Options]
                   ([votes]
                   ,[value]
                   ,[submited]
                   ,[option]
                   ,[PollCardsID])
             VALUES
                   ('${Options[i].votes}'
                   ,'${Options[i].value}'
                   ,'0'
                   ,'${Options[i].option}'
                   ,'${pollrecordId}')
        `;
      var optInsert = await pool.request().query(insrtOptQuery);
    }

    res.status(200).send("Successfully Added your Polls!");
  } catch (error) {
    res.status(400).send("can't add poll");
  }
};
const getPolls = async (req, res) => {
  const pool = await poolPromise;
  var query = `SELECT 	*
  FROM [PollCards]
  LEFT JOIN [dbo].[Options]
      on [PollCards].Id = [dbo].[Options].PollCardsID
      for json auto`;

  const rs = await pool.request().query(query);

  const filtered = Object.values(rs.recordset[0])[0];

  res.send(filtered);
};
const getMyPolls = async (req, res) => {
  const pool = await poolPromise;
  const email = req.params.email;
  var queryuser = `SELECT * FROM PollUsers where email = "${email}"`;
  var userID = queryuser[0].UserID;
  //where email = email
  //or where userid = userid
  var query = `SELECT * FROM PollCards where UserID =${userID}`;
  const rs = await pool.request().query(query);
  res.send(rs.recordsets);
};
const getActivePolls = async (req, res) => {
  const pool = await poolPromise;
  const email = req.params.email;
  var queryuser = `SELECT * FROM PollUsers where email = "${email}"`;
  const rsUser = await pool.request().query(queryuser);
  var userID = rsUser.recordsets[0].UserID;
  //where email = email
  //or where userid = userid
  var query = `SELECT * FROM PollCards where UserID =${userID}`;
  const rs = await pool.request().query(query);
  res.send(rs.recordsets);
};
const submit = async (req, res) => {
  const option = req.params.option;
  try {
    const pool = await poolPromise;
    // const title = req.params.title;
    // var querypoll = `SELECT * FROM PollUsers where email = "${title}"`;
    res.send("Success");
    var votesQuery = `update Options set [votes] =[votes]+1 where  [option]='${option}'`;
    const updateVotes = await pool.request().query(votesQuery);
  } catch (error) {
    res.send(error);
  }

  // query options then filter then update filtered option array
};
module.exports = { addPolls, getPolls, getMyPolls, getActivePolls, submit };
