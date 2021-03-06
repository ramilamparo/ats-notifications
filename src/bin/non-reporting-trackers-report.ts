#!/usr/bin/env node
import { NonReportingTrackersReport } from "../utils/NonReportingTrackersReport";
import {
	args,
	options,
	mail,
	database,
	securepath,
	wialon
} from "../config/non-reporting-trackers-report";

if (args.h || args.help) {
	console.log(`Work in progress...`);
	process.exit(0);
}

NonReportingTrackersReport.create(
	{
		database,
		securepath,
		wialon,
		mail: mail || undefined
	},
	{
		threshold: options.threshold
	},
	{
		columns: options.columns,
		clients: options.clients
	}
)
	.then(async (serviceReport) => {
		// Send only if the service report has any pending services.
		if (serviceReport.data.length > 0) {
			if (mail && options.recipients) {
				const sent = await serviceReport.sendReportByEmail({
					mailConfig: mail,
					recipients: options.recipients,
					threshold: options.threshold,
					cc: options.cc
				});
				console.log(sent);
			} else {
				const table = serviceReport.getTextTable();
				console.log(table.render());
			}
		}
		process.exit(0);
	})
	.catch((e) => {
		console.log(e);
		process.exit(2);
	});
