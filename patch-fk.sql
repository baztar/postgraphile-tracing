alter table name_basics add constraint name_basics_pk primary key (nconst);

alter table title_basics add constraint title_basics_pk primary key (tconst);

alter table title_crew add constraint title_crew_title_basics_fk foreign key (tconst) references title_basics(tconst);

alter table title_episode add constraint title_episode_title_basics_fk foreign key ("parentTconst") references title_basics(tconst) not valid;

alter table title_principals add constraint title_principals_title_basics_fk foreign key (tconst) references title_basics(tconst) not valid;
alter table title_principals add constraint title_principals_name_basics_fk foreign key (nconst) references name_basics(nconst) not valid;

alter table title_akas add constraint title_akas_title_basics_fk foreign key ("titleId") references title_basics(tconst) not valid;

alter table title_ratings add constraint title_ratings_title_basics_fk foreign key (tconst) references title_basics(tconst) not valid;