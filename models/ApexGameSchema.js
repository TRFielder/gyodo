import { Schema } from "mongoose";

const ApexGame = new Schema({
	Legend: {
		type: String,
	},
	Kills: {
		type: Number,
	},
	Deaths: {
		type: Number,
	},
	Assists: {
		type: Number,
	},
	Damage: {
		type: Number,
	},
	Win: {
		type: Boolean,
	},
});

export default ApexGame;
