-- Editors and administrators can manage every content table from the CMS.
-- Public read policies from the initial migration remain unchanged.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'consecration_stages',
    'consecration_day_sections',
    'scripture_references',
    'doctrinal_references',
    'examination_questions',
    'prayers',
    'media_assets',
    'resources'
  ] loop
    execute format(
      'create policy "editors manage %1$s" on public.%1$I for all to authenticated using (public.has_role(auth.uid(), ''admin'') or public.has_role(auth.uid(), ''editor'')) with check (public.has_role(auth.uid(), ''admin'') or public.has_role(auth.uid(), ''editor''))',
      table_name
    );
  end loop;
end $$;

-- Draft content must be visible to the people who edit it.
create policy "editors read all consecrations" on public.consecrations
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));

create policy "editors read all days" on public.consecration_days
  for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));

create index if not exists prayers_consecration_sort_idx
  on public.prayers (consecration_id, sort_order);
create index if not exists resources_consecration_sort_idx
  on public.resources (consecration_id, sort_order);
