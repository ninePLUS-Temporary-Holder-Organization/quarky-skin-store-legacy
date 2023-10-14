module.exports = {
	apps : [{
		name: `quarky-skin-store-kojirou`,
		script: 'npm run start',
		env_phoenix: {
			QS_ENV: "kojirou",
			NODE_ENV: "production"
		}
	},{
		name: `quarky-skin-store-senpai`,
		script: 'npm run start',
		env_production: {
			QS_ENV: "senpai",
			NODE_ENV: "production"
		}
	}],
	// Deployment Configuration
	deploy : {
		kojirou : {
			"user" : "q2",
			"host" : ["cirno.yggdrasil.cat"],
			"ref"  : "origin/kojirou",
			"repo" : "git@github.com:meower-holdings/quarky-skin-store.git",
			"path" : "/home/q2/kojirou",
			"post-deploy" : "yarn install && pm2 startOrRestart yggdrasil.config.cjs --only quarky-skin-store-kojirou --env kojirou"
		},
		senpai : {
			"user" : "q2",
			"host" : ["cirno.yggdrasil.cat"],
			"ref"  : "origin/senpai",
			"repo" : "git@github.com:meower-holdings/quarky-skin-store.git",
			"path" : "/home/q2/senpai",
			"post-deploy" : "yarn install && pm2 startOrRestart yggdrasil.config.cjs --only quarky-skin-store-senpai --env production"
		}
	}
};