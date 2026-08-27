# Deployment Documentation

You can deploy the application on various platforms. Below are the steps to deploy on Render's free tier and set up the database using Supabase.

## Deploying on Render Free Tier

1. Create a new web service on Render.
2. Connect your GitHub repository to Render.
3. Set the build command to `npm install && npm run build`.
4. Set the start command to `npm run prestart && npm run start`.
5. Set the environment variables, check the `.env.example` file for reference.
6. Deploy the service and wait for it to finish building.
7. Once the deployment is complete, you can access your application using the provided Render URL.

Note: 

- Since Render's free tier has limitations, you may experience some downtime or slower response times. Consider upgrading to a paid plan for better performance and reliability.

- Cold start may cause cors preflight errors. If you encounter this issue, try refreshing the page after a few seconds. To prevent this, you can upgrade to a paid plan or use a different hosting provider that offers better performance.

- Domain Name: If you want to use a custom domain name, you can configure it in the Render dashboard. Follow the instructions provided by Render to set up your domain and SSL certificate.

## Setting up Database using Supabase

1. Create a new project on Supabase.
2. Copy the connection string from the Supabase dashboard and set it as an environment variable in your Render service.
3. Redeploy the service if you already deployed it before setting the environment variable.
4. The start command will automatically run the Prisma migrations to set up the database schema.
5. You can access the Supabase dashboard to manage your database, view tables, and run queries.