import styled from '@emotion/styled';

import Breadcrumbs from 'sentry/components/breadcrumbs';
import FeatureBadge from 'sentry/components/featureBadge';
import * as Layout from 'sentry/components/layouts/thirds';
import {DatePageFilter} from 'sentry/components/organizations/datePageFilter';
import PageFilterBar from 'sentry/components/organizations/pageFilterBar';
import {ProjectPageFilter} from 'sentry/components/organizations/projectPageFilter';
import {t} from 'sentry/locale';
import {space} from 'sentry/styles/space';
import {RateUnits} from 'sentry/utils/discover/fields';
import useOrganization from 'sentry/utils/useOrganization';
import {normalizeUrl} from 'sentry/utils/withDomainRequired';
import ImageView from 'sentry/views/performance/browser/resources/imageView';
import JSCSSView, {
  DEFAULT_RESOURCE_TYPES,
  FilterOptionsContainer,
} from 'sentry/views/performance/browser/resources/jsCssView';
import {
  BrowserStarfishFields,
  useResourceModuleFilters,
} from 'sentry/views/performance/browser/resources/utils/useResourceFilters';
import {DEFAULT_RESOURCE_FILTERS} from 'sentry/views/performance/browser/resources/utils/useResourcesQuery';
import {ModulePageProviders} from 'sentry/views/performance/database/modulePageProviders';
import {DomainSelector} from 'sentry/views/starfish/views/spans/selectors/domainSelector';

const {SPAN_OP, SPAN_DOMAIN} = BrowserStarfishFields;

export const RESOURCE_THROUGHPUT_UNIT = RateUnits.PER_MINUTE;

function ResourcesLandingPage() {
  const organization = useOrganization();
  const filters = useResourceModuleFilters();

  return (
    <ModulePageProviders
      title={[t('Performance'), t('Resources')].join(' — ')}
      baseURL="/performance/browser/resources"
    >
      <Layout.Header>
        <Layout.HeaderContent>
          <Breadcrumbs
            crumbs={[
              {
                label: 'Performance',
                to: normalizeUrl(`/organizations/${organization.slug}/performance/`),
                preservePageFilters: true,
              },
              {
                label: 'Resources',
              },
            ]}
          />

          <Layout.Title>
            {t('Resources')}
            <FeatureBadge type="alpha" />
          </Layout.Title>
        </Layout.HeaderContent>
      </Layout.Header>

      <Layout.Body>
        <Layout.Main fullWidth>
          <FilterOptionsContainer>
            <PageFilterBar condensed>
              <ProjectPageFilter />
              <DatePageFilter />
            </PageFilterBar>
            <DomainSelector
              emptyOptionLocation="top"
              value={filters[SPAN_DOMAIN] || ''}
              additionalQuery={[
                ...DEFAULT_RESOURCE_FILTERS,
                `${SPAN_OP}:[${DEFAULT_RESOURCE_TYPES.join(',')}]`,
              ]}
            />
          </FilterOptionsContainer>

          {(!filters[SPAN_OP] ||
            filters[SPAN_OP] === 'resource.script' ||
            filters[SPAN_OP] === 'resource.css') && <JSCSSView />}

          {filters[SPAN_OP] === 'resource.img' && <ImageView />}
        </Layout.Main>
      </Layout.Body>
    </ModulePageProviders>
  );
}

export const PaddedContainer = styled('div')`
  margin-bottom: ${space(2)};
`;

export default ResourcesLandingPage;
