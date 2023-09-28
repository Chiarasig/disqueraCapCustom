using { cuid, managed } from '@sap/cds/common';
namespace disquera;

aspect name {
    name: String(25);
}
type MusicGenre: String(3) enum {
    Rock       = 'Rock';
    Pop        = 'Pop';
    HipHop     = 'HipHop';
    Jazz       = 'Jazz';
    Blues      = 'Blues';
    Electronic = 'Electronic';
    Classical  = 'Classical';
    Reggae     = 'Reggae';
    Country    = 'Country';
}


entity Musicians : cuid, managed {
    first_name: String(25);
    last_name: String(25);
    band: Composition of  many Musicians_Bands on band.musicians = $self;
    session: Composition of many Sessions on session.musician = $self;
}

entity Bands : cuid, managed, name{
    genre: MusicGenre;
    musicians: Composition of  many Musicians_Bands on musicians.band = $self;
    records: Association to many Records on records.band = $self;
}

entity Musicians_Bands : cuid, managed {
    key band: Association to Bands;
    key musicians: Association to Musicians;
}

entity Records : cuid, managed, name {
    band: Association to Bands;
    distribution: Composition of  many Records_Distribution on distribution.record = $self;
    session: Composition of many Sessions on session.record = $self;
    amount: Integer;
}

entity Distribution : cuid, managed, name {
    address: String(25);
    record: Composition of  many Records_Distribution on record.distribution = $self;
}

entity Records_Distribution : cuid, managed {
    key record: Association to Records;
    key distribution: Association to Distribution;
}

entity Sessions : cuid, managed {
    musician: Association to Musicians;
    record: Association to Records;
    hours: Integer;
    hasFreeHours: Boolean default false;
}