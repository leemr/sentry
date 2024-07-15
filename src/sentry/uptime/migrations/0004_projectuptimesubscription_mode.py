# Generated by Django 5.0.6 on 2024-06-26 07:06

import django.db.models.deletion
from django.db import migrations, models

import sentry.db.models.fields.foreignkey
from sentry.new_migrations.migrations import CheckedMigration


class Migration(CheckedMigration):
    # This flag is used to mark that a migration shouldn't be automatically run in production.
    # This should only be used for operations where it's safe to run the migration after your
    # code has deployed. So this should not be used for most operations that alter the schema
    # of a table.
    # Here are some things that make sense to mark as post deployment:
    # - Large data migrations. Typically we want these to be run manually so that they can be
    #   monitored and not block the deploy for a long period of time while they run.
    # - Adding indexes to large tables. Since this can take a long time, we'd generally prefer to
    #   run this outside deployments so that we don't block them. Note that while adding an index
    #   is a schema change, it's completely safe to run the operation after the code has deployed.
    # Once deployed, run these manually via: https://develop.sentry.dev/database-migrations/#migration-deployment

    is_post_deployment = False

    dependencies = [
        ("sentry", "0731_add_insight_project_flags"),
        ("uptime", "0003_drop_remote_subscription"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="projectuptimesubscription",
            name="uptime_projectuptimesubscription_unique_project_subscription",
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    'ALTER TABLE "uptime_projectuptimesubscription" ADD COLUMN "mode" smallint NOT NULL DEFAULT 1;',
                    reverse_sql='ALTER TABLE "uptime_projectuptimesubscription" DROP COLUMN "mode";',
                    hints={"tables": ["uptime_projectuptimesubscription"]},
                ),
            ],
            state_operations=[
                migrations.AddField(
                    model_name="projectuptimesubscription",
                    name="mode",
                    field=models.SmallIntegerField(default=1),
                ),
            ],
        ),
        migrations.AlterField(
            model_name="projectuptimesubscription",
            name="uptime_subscription",
            field=sentry.db.models.fields.foreignkey.FlexibleForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to="uptime.uptimesubscription"
            ),
        ),
        migrations.AddIndex(
            model_name="projectuptimesubscription",
            index=models.Index(fields=["project", "mode"], name="uptime_proj_project_30b94a_idx"),
        ),
        migrations.AddConstraint(
            model_name="projectuptimesubscription",
            constraint=models.UniqueConstraint(
                condition=models.Q(("mode", 1)),
                fields=("project_id", "uptime_subscription"),
                name="uptime_projectuptimesubscription_unique_manual_project_subscription",
            ),
        ),
        migrations.AddConstraint(
            model_name="projectuptimesubscription",
            constraint=models.UniqueConstraint(
                condition=models.Q(("mode__in", (2, 3))),
                fields=("project_id", "uptime_subscription"),
                name="uptime_projectuptimesubscription_unique_auto_project_subscription",
            ),
        ),
    ]